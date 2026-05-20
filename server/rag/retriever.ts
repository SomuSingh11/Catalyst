import prisma from "@/lib/db";
import { ChunkType } from "@prisma/client";
import { generateEmbedding } from "@/lib/services/gemini";

const ACTIVE_DIM = 768;
const ACTIVE_MODEL = "cloud:gemini/text-embedding-001";

// ─── Types ───────────────────────────────────────────────────

export interface RetrievedChunk {
  id: string;
  filePath: string;
  language: string;
  chunkType: ChunkType;
  entityName?: string | null;
  parentName?: string | null;
  rawCode: string;
  signature?: string | null;
  docstring?: string | null;
  fileSummary?: string | null;
  startLine: number;
  endLine: number;
  score: number; // final relevance score after reranking
  semanticScore: number;
  keywordScore: number;
}

export interface RagResult {
  chunks: RetrievedChunk[];
  context: string;
  sources: Array<{
    filePath: string;
    entityName?: string | null;
    startLine: number;
  }>;
  totalTokens: number;
}

// ─── Internal DB result type ──────────────────────────────────

interface RawResult {
  id: string;
  filePath: string;
  language: string;
  chunkType: string;
  entityName: string | null;
  parentName: string | null;
  rawCode: string;
  signature: string | null;
  docstring: string | null;
  fileSummary: string | null;
  startLine: number;
  endLine: number;
  similarity: number;
}

// ─── Main retrieval pipeline ─────────────────────────────────

/**
 * Full RAG retrieval pipeline:
 * 1. Semantic search (pgvector cosine on both code + context embeddings)
 * 2. Full-text keyword search (pg_trgm on rawCode + entityName)
 * 3. Reciprocal Rank Fusion to merge results
 * 4. Rerank top candidates
 * 5. MMR for diversity
 * 6. Assemble context with token budget
 */

export async function retrieve(
  query: string,
  projectId: string,
  options: {
    k?: number; // how many chunks to return
    maxTokens?: number; // limit for LLM input
    chunkTypes?: string[]; // optional filtering
  },
): Promise<RagResult> {
  const { k = 8, maxTokens = 12_000, chunkTypes } = options;

  // 0. Model consistency guard
  const sample = await prisma.codeChunk.findFirst({
    where: { projectId, embeddingModel: { not: null } },
    select: { embeddingModel: true },
  });

  if (sample?.embeddingModel && sample.embeddingModel !== ACTIVE_MODEL) {
    throw new Error(
      `Embedding model mismatch. Expected ${ACTIVE_MODEL}, but found ${sample.embeddingModel}. ` +
        `Please regenerate embeddings for project ${projectId} using the active model.`,
    );
  }

  // 1. Embed query using Gemini directly
  const queryEmbedding = await generateEmbedding(query);
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  // 2. Hybrid search: semantic (pgvector) + keyword (pg_trgm)
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(vectorStr, projectId, 30, chunkTypes),
    keywordSearch(query, projectId, 20, chunkTypes),
  ]);

  // 3. Reciprocal Rank Fusion — merges the two ranked lists
  const fused = reciprocalRankFusion(semanticResults, keywordResults);

  // 4. MMR selection — diversity within the top results
  const diverse = mmrSelect(
    fused.slice(0, 20),
    queryEmbedding,
    Math.min(k, fused.length),
    0.65, // lambda: 1 = pure relevance, 0 = pure diversity
  );

  // 5. Assemble context string within token budget
  const { context, usedChunks, totalTokens } = assembleContext(
    diverse,
    maxTokens,
  );

  return {
    chunks: usedChunks,
    context,
    sources: usedChunks.map((c: RetrievedChunk) => ({
      filePath: c.filePath,
      entityName: c.entityName,
      startLine: c.startLine,
    })),
    totalTokens,
  };
}

// ─── Semantic search ──────────────────────────────────────────
// Joins CodeChunk with the dimension-specific embedding table.
// Searches both codeEmbedding and contextEmbedding, keeps best per chunk.

async function semanticSearch(
  vectorStr: string,
  projectId: string,
  limit: number,
  chunkTypes?: string[],
): Promise<RetrievedChunk[]> {
  // Builds a dynamic SQL filter for matching allowed chunk types in queries
  const chunkTypeFilter = typeFilter(chunkTypes, "c");

  // Intent-based: finds chunks by what they DO
  const contextResults = await prisma.$queryRawUnsafe<RawResult[]>(`
    SELECT
      c.id,
      c."filePath",
      c.language,
      c."chunkType",
      c."entityName",
      c."parentName",
      c."rawCode",
      c.signature,
      c.docstring,
      c."fileSummary",
      c."startLine",
      c."endLine",
      1 - (e."contextEmbedding" <=> '${vectorStr}'::vector(${ACTIVE_DIM})) AS similarity
    FROM "CodeChunk" c
    INNER JOIN "ChunkEmbedding768" e ON e."chunkId" = c.id
    WHERE c."projectId" = '${projectId}'
      AND e."contextEmbedding" IS NOT NULL
      ${chunkTypeFilter}
    ORDER BY e."contextEmbedding" <=> '${vectorStr}'::vector(${ACTIVE_DIM})
    LIMIT ${limit}
  `);

  // Implementation-based: finds chunks by HOW they are written
  const codeResults = await prisma.$queryRawUnsafe<RawResult[]>(`
    SELECT
      c.id,
      c."filePath",
      c.language,
      c."chunkType",
      c."entityName",
      c."parentName",
      c."rawCode",
      c.signature,
      c.docstring,
      c."fileSummary",
      c."startLine",
      c."endLine",
      1 - (e."codeEmbedding" <=> '${vectorStr}'::vector(${ACTIVE_DIM})) AS similarity
    FROM "CodeChunk" c
    INNER JOIN "ChunkEmbedding768" e ON e."chunkId" = c.id
    WHERE c."projectId" = '${projectId}'
      AND e."codeEmbedding" IS NOT NULL
      ${chunkTypeFilter}
    ORDER BY e."codeEmbedding" <=> '${vectorStr}'::vector(${ACTIVE_DIM})
    LIMIT ${limit}
  `);

  // Merge: keep highest similarity per chunk
  const best = new Map<string, RawResult>();
  for (const r of [...contextResults, ...codeResults]) {
    const existing = best.get(r.id);
    if (!existing || r.similarity > existing.similarity) {
      best.set(r.id, r);
    }
  }

  return Array.from(best.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((r) => toChunk(r, r.similarity, 0));
}

// ─── Keyword search ───────────────────────────────────────────
// pg_trgm fuzzy match — no embeddings needed, always works.

async function keywordSearch(
  query: string,
  projectId: string,
  limit: number,
  chunkTypes?: string[],
): Promise<RetrievedChunk[]> {
  const chunkTypeFilter = typeFilter(chunkTypes, "");

  // Strip chars that break pg_trgm similarity()
  const safe = query
    .replace(/['"\\;%]/g, " ")
    .trim()
    .slice(0, 200);

  try {
    const results = await prisma.$queryRawUnsafe<RawResult[]>(`
      SELECT
        id,
        "filePath",
        language,
        "chunkType",
        "entityName",
        "parentName",
        "rawCode",
        signature,
        docstring,
        "fileSummary",
        "startLine",
        "endLine",
        GREATEST(
          similarity("rawCode",                '${safe}'),
          COALESCE(similarity("entityName",    '${safe}'), 0),
          COALESCE(similarity(signature,       '${safe}'), 0)
        ) AS similarity
      FROM "CodeChunk"
      WHERE "projectId" = '${projectId}'
        ${chunkTypeFilter}
        AND (
          "rawCode"                    % '${safe}'
          OR COALESCE("entityName",  '') % '${safe}'
          OR COALESCE(signature,     '') % '${safe}'
        )
      ORDER BY similarity DESC
      LIMIT ${limit}
    `);

    return results.map((r) => toChunk(r, 0, r.similarity));
  } catch {
    console.warn("[retriever] Keyword search skipped — pg_trgm not installed");
    return [];
  }
}

// ─── Reciprocal Rank Fusion ───────────────────────────────────
// Merges two ranked lists without caring about their score scales.
// k=60 is the standard constant.

function reciprocalRankFusion(
  listA: RetrievedChunk[],
  listB: RetrievedChunk[],
  k = 60,
): RetrievedChunk[] {
  const scores = new Map<string, { chunk: RetrievedChunk; score: number }>();

  const add = (list: RetrievedChunk[], weight: number) => {
    list.forEach((chunk, rank) => {
      const rrf = weight * (1 / (k + rank + 1));
      const hit = scores.get(chunk.id);

      if (hit) {
        hit.score += rrf;
        hit.chunk.semanticScore = Math.max(
          hit.chunk.semanticScore,
          chunk.semanticScore,
        );
        hit.chunk.keywordScore = Math.max(
          hit.chunk.keywordScore,
          chunk.keywordScore,
        );
      } else {
        scores.set(chunk.id, { chunk: { ...chunk }, score: rrf });
      }
    });
  };

  add(listA, 1.0); // semantic — full weight
  add(listB, 0.8); // keyword  — slightly lower

  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .map(({ chunk, score }) => ({ ...chunk, score }));
}

// ─── MMR selection ────────────────────────────────────────────
// Maximal Marginal Relevance: prevents returning 8 chunks
// from the same file. lambda=0.65 balances relevance vs diversity.

function mmrSelect(
  chunks: RetrievedChunk[],
  _queryEmbedding: number[],
  k: number,
  lambda: number,
): RetrievedChunk[] {
  if (chunks.length === 0) return [];
  if (chunks.length <= k) return chunks;

  const selected: RetrievedChunk[] = [];
  const remaining = [...chunks];

  // First: highest RRF score
  selected.push(remaining.splice(0, 1)[0]!);

  while (selected.length < k && remaining.length > 0) {
    let bestMmr = -Infinity;
    let bestIdx = 0;

    remaining.forEach((candidate, idx) => {
      const relevance = candidate.score;
      const maxRedundancy = selected.reduce(
        (max, sel) => Math.max(max, jaccardSim(candidate.rawCode, sel.rawCode)),
        0,
      );
      const mmr = lambda * relevance - (1 - lambda) * maxRedundancy;
      if (mmr > bestMmr) {
        bestMmr = mmr;
        bestIdx = idx;
      }
    });

    selected.push(remaining.splice(bestIdx, 1)[0]!);
  }

  return selected;
}

function jaccardSim(a: string, b: string): number {
  const words = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3),
    );
  const sa = words(a);
  const sb = words(b);
  const intersection = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─── Context assembly ─────────────────────────────────────────
// Builds the prompt context string within a token budget.
// FILE_SUMMARY chunks always come first for better LLM framing.

function assembleContext(
  chunks: RetrievedChunk[],
  maxTokens: number,
): { context: string; usedChunks: RetrievedChunk[]; totalTokens: number } {
  const sorted = [...chunks].sort((a, b) => {
    if (a.chunkType === "FILE_SUMMARY" && b.chunkType !== "FILE_SUMMARY")
      return -1;
    if (b.chunkType === "FILE_SUMMARY" && a.chunkType !== "FILE_SUMMARY")
      return 1;
    return b.score - a.score;
  });

  const parts: string[] = [];
  const usedChunks: RetrievedChunk[] = [];
  let totalTokens = 0;

  for (const chunk of sorted) {
    const full = formatChunk(chunk, false);
    const tokens = estimateTokens(full);

    if (totalTokens + tokens > maxTokens) {
      // Try a truncated version before skipping
      const trunc = formatChunk(chunk, true);
      const truncTokens = estimateTokens(trunc);
      if (totalTokens + truncTokens <= maxTokens) {
        parts.push(trunc);
        usedChunks.push(chunk);
        totalTokens += truncTokens;
      }
      continue;
    }

    parts.push(full);
    usedChunks.push(chunk);
    totalTokens += tokens;
  }

  return {
    context: parts.join("\n\n---\n\n"),
    usedChunks,
    totalTokens,
  };
}

function formatChunk(chunk: RetrievedChunk, truncate: boolean): string {
  const loc = `${chunk.filePath}:${chunk.startLine}-${chunk.endLine}`;
  const entity = chunk.entityName
    ? ` [${chunk.chunkType}: ${chunk.parentName ? `${chunk.parentName}.` : ""}${chunk.entityName}]`
    : ` [${chunk.chunkType}]`;

  const lines: string[] = [`// ${loc}${entity}`];

  if (chunk.docstring && !truncate) {
    lines.push(chunk.docstring);
  }

  lines.push(
    truncate
      ? chunk.rawCode.slice(0, 800) + "\n// ... (truncated)"
      : chunk.rawCode,
  );

  return lines.join("\n");
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─── Helpers ─────────────────────────────────────────────────

function typeFilter(chunkTypes: string[] | undefined, alias: string): string {
  if (!chunkTypes || chunkTypes.length == 0) return "";
  const col = alias ? `${alias}."chunkType"` : `"chunkType"`;
  const quoted = chunkTypes.map((t) => `'${t}'`).join(", ");
  return `AND ${col} = ANY(ARRAY[${quoted}]::text[])`;
}

function toChunk(
  r: RawResult,
  semanticScore: number,
  keywordScore: number,
): RetrievedChunk {
  return {
    id: r.id,
    filePath: r.filePath,
    language: r.language,
    chunkType: r.chunkType as ChunkType,
    entityName: r.entityName,
    parentName: r.parentName,
    rawCode: r.rawCode,
    signature: r.signature,
    docstring: r.docstring,
    fileSummary: r.fileSummary,
    startLine: r.startLine,
    endLine: r.endLine,
    score: semanticScore + keywordScore,
    semanticScore,
    keywordScore,
  };
}
