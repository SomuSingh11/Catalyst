import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/db";
import { TreeSitterParser } from "@/lib/parser/engines/tree-sitter-engine";
import { IndexingProgressFn } from "@/types/gitWhiz";
import simpleGit from "simple-git";
import { rimraf } from "rimraf";
import { chunkFile, CodeChunkInput } from "@/server/rag/chunker";
import {
  batchGenerateEmbeddings,
  summariseChunk,
  summarizeFile,
} from "../services/gemini";

const ACTIVE_MODEL = "cloud:gemini/text-embedding-001";
const ACTIVE_DIM = 768;

const parser = new TreeSitterParser();

// ─── File filters ─────────────────────────────────────────────

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  ".cache",
  "coverage",
  ".nyc_output",
  "tmp",
  "temp",
  ".vscode",
  ".idea",
  "vendor",
  ".gradle",
  "target",
  ".mvn",
  "__pycache__",
  ".pytest_cache",
  "venv",
  ".env",
  "out",
]);

const CODE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".cs",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".swift",
  ".kt",
  ".dart",
  ".scala",
  ".clj",
  ".hs",
  ".ml",
  ".r",
  ".sql",
  ".sh",
  ".bash",
  ".zsh",
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".vue",
  ".svelte",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
  ".xml",
  ".md",
  ".prisma",
  ".graphql",
  ".gql",
]);

const IGNORE_PATTERNS = [
  // Lock files
  /^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb|composer\.lock)$/,
  // Log files
  /\.(log|logs)$/i,
  // Build artifacts
  /\.(min\.js|bundle\.js|chunk\.js)$/i,
  // Images and assets
  /\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf)$/i,
  // Temporary files
  /\.(tmp|temp|cache|swp|swo)$/i,
  // Environment files
  /^\.env/,
  // Map files
  /\.map$/i,
];

function shouldIgnore(relativePath: string, fileName: string): boolean {
  const parts = relativePath.split(path.sep);
  if (parts.some((p) => IGNORE_DIRS.has(p))) return true;
  if (IGNORE_PATTERNS.some((pattern) => pattern.test(fileName))) return true;
  return false;
}

function isCodeFile(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  if (CODE_EXTENSIONS.has(ext)) return true;
  const lower = fileName.toLowerCase();
  return ["dockerfile", "makefile", "readme"].some((n) => lower.includes(n));
}

// ─── Source file type ─────────────────────────────────────────
interface SourceFile {
  relativePath: string;
  content: string;
}

// ─── Phase 1: Clone + load ────────────────────────────────────

async function cloneAndLoad(
  githubUrl: string,
  onProgress: (progress: IndexingProgressFn) => void,
): Promise<{ files: SourceFile[]; tempDir: string }> {
  const tempDir = await fs.mkdtemp(path.join(process.cwd(), ".temp-repo-"));

  onProgress({
    status: "cloning",
    message: "Cloning repository...",
    percentage: 5,
  });

  try {
    await simpleGit().clone(githubUrl, tempDir, ["--depth", "1"]);
  } catch (error: unknown) {
    await rimraf(tempDir);
    const msg = (error as Error).message?.toLowerCase() ?? "";
    if (msg.includes("authentication") || msg.includes("permission")) {
      throw new Error("Repository is private or authentication failed.");
    }
    throw new Error(`Clone failed: ${(error as Error).message}`);
  }

  onProgress({
    status: "cloning",
    message: "Cloned. Scanning files...",
    percentage: 15,
  });

  const files: SourceFile[] = [];

  async function readDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(tempDir, fullPath);

      if (shouldIgnore(relativePath, entry.name)) continue;

      if (entry.isDirectory()) {
        await readDir(fullPath);
      } else if (isCodeFile(entry.name)) {
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          if (content.length < 10 || content.length > 150_000) continue;
          files.push({ relativePath, content });
        } catch {
          // binary or unreadable — skip
        }
      }
    }
  }

  await readDir(tempDir);

  onProgress({
    status: "cloning",
    percentage: 20,
    message: `Found ${files.length} source files`,
    total: files.length,
  });

  return { files, tempDir };
}

// ─── Main pipeline ────────────────────────────────────────────

export async function indexProject(
  jobId: string,
  projectId: string,
  githubUrl: string,
  onProgress: (progress: IndexingProgressFn) => void,
): Promise<void> {
  let tempDir: string | null = null;

  try {
    await updateJob(jobId, {
      status: "RUNNING",
      phase: "cloning",
      startedAt: new Date(),
    });

    // ── Phase 1: Clone ───────────────────────────────────────
    const { files, tempDir: td } = await cloneAndLoad(githubUrl, onProgress);
    tempDir = td;

    if (files.length === 0)
      throw new Error("No source files found in the repository.");

    // ── Phase 2: Parse ───────────────────────────────────────
    onProgress({
      status: "parsing",
      percentage: 22,
      message: "Parsing source files...",
    });
    await updateJob(jobId, { phase: "parsing" });

    const parsed: Array<{
      result: Awaited<ReturnType<typeof parser.parse>>;
      file: SourceFile;
    }> = [];

    for (const file of files) {
      try {
        const result = await parser.parse(file.relativePath, file.content);
        parsed.push({ result, file });
      } catch {
        // unparseable file — skip silently
      }
    }

    onProgress({
      status: "parsing",
      percentage: 28,
      message: `Parsed ${parsed.length} / ${files.length} files`,
    });

    // ── Phase 3: Chunk ───────────────────────────────────────
    onProgress({
      status: "chunking",
      percentage: 30,
      message: "Chunking into entities...",
    });
    await updateJob(jobId, { phase: "chunking" });

    const allChunks: CodeChunkInput[] = [];

    for (const { result, file } of parsed) {
      const chunks = chunkFile(result, file.content);
      chunks.forEach((c) => {
        c.projectId = projectId;
      });
      allChunks.push(...chunks);
    }

    onProgress({
      status: "chunking",
      percentage: 38,
      message: `Created ${allChunks.length} chunks from ${parsed.length} files`,
      totalChunks: allChunks.length,
    });
    await updateJob(jobId, { totalChunks: allChunks.length });

    // ── Phase 4: Summarize ───────────────────────────────────
    onProgress({
      status: "summarizing",
      percentage: 40,
      message: "Generating summaries...",
    });
    await updateJob(jobId, { phase: "summarizing" });

    // File-level summaries (for FILE_SUMMARY chunks)
    const fileSummaryMap = new Map<string, string>();
    for (const { result, file } of parsed) {
      const exportedEntities = result.entities
        .filter((e) => e.type === "export" || e.modifiers?.includes("export"))
        .slice(0, 15)
        .map((e) => ({ name: e.name, type: e.type, signature: e.signature }));

      try {
        const summary = await summarizeFile({
          filePath: file.relativePath,
          language: result.language,
          entities: exportedEntities,
          rawCode: file.content,
        });
        fileSummaryMap.set(file.relativePath, summary);
      } catch {
        // non-critical — chunk will just have no fileSummary
      }
    }

    // Entity-level summaries
    const SUMMABLE = new Set(["FUNCTION", "CLASS", "METHOD", "INTERFACE"]);
    const chunkDocstrings = new Map<number, string>();

    for (let i = 0; i < allChunks.length; i++) {
      const chunk = allChunks[i];
      if (!SUMMABLE.has(chunk.chunkType)) continue;

      try {
        const summary = await summariseChunk({
          filePath: chunk.filePath,
          language: chunk.language,
          chunkType: chunk.chunkType,
          entityName: chunk.entityName,
          rawCode: chunk.rawCode,
          signature: chunk.signature ?? undefined,
        });
        chunkDocstrings.set(i, summary);
      } catch {
        // non-critical
      }

      if (i % 10 === 0) {
        const pct = 40 + Math.round((i / allChunks.length) * 20);
        onProgress({
          status: "summarizing",
          percentage: pct,
          message: `Summarized ${i + 1} / ${allChunks.length} chunks`,
          doneChunks: i + 1,
          totalChunks: allChunks.length,
        });
        await updateJob(jobId, { doneChunks: i + 1 });
      }
    }

    // ── Phase 5: Store chunks (no embeddings yet) ────────────
    onProgress({
      status: "storing",
      percentage: 62,
      message: "Saving chunks...",
    });
    await updateJob(jobId, { phase: "storing" });

    // Delete existing chunks for this project (re-index = full replace)
    await prisma.codeChunk.deleteMany({ where: { projectId } });

    const BATCH_SIZE = 50;
    const createdIds: string[] = [];

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
      const batch = allChunks.slice(i, i + BATCH_SIZE);
      const created = await Promise.all(
        batch.map((chunk, j) => {
          const globalIdx = i + j;
          const generatedDocstring = chunkDocstrings.get(globalIdx);
          const fileSummary =
            chunk.chunkType === "FILE_SUMMARY"
              ? fileSummaryMap.get(chunk.filePath)
              : undefined;

          return prisma.codeChunk.create({
            data: {
              projectId: chunk.projectId,
              filePath: chunk.filePath,
              language: chunk.language,
              startLine: chunk.startLine,
              endLine: chunk.endLine,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              chunkType: chunk.chunkType as any,
              entityName: chunk.entityName,
              parentName: chunk.parentName,
              rawCode: chunk.rawCode,
              signature: chunk.signature,
              docstring: generatedDocstring ?? chunk.docstring,
              fileSummary: fileSummary,
              complexity: chunk.complexity,
              tokenCount: Math.ceil(chunk.rawCode.length / 4),
              linesOfCode: chunk.endLine - chunk.startLine + 1,
            },
          });
        }),
      );
      createdIds.push(...created.map((c) => c.id));
    }

    // ── Phase 6: Embed ───────────────────────────────────────
    onProgress({
      status: "embedding",
      percentage: 65,
      message: `Generating embeddings for ${createdIds.length} chunks...`,
    });
    await updateJob(jobId, { phase: "embedding" });

    const chunkRows = await prisma.codeChunk.findMany({
      where: { id: { in: createdIds } },
      select: {
        id: true,
        rawCode: true,
        signature: true,
        docstring: true,
        filePath: true,
        entityName: true,
      },
    });

    // codeText    → embeds rawCode      → codeEmbedding column
    // contextText → embeds intent info  → contextEmbedding column
    const codeTexts = chunkRows.map((c) => c.rawCode);
    const contextTexts = chunkRows.map((c) =>
      [
        c.signature ?? "",
        c.docstring ?? "",
        `File: ${c.filePath}`,
        c.entityName ? `Entity: ${c.entityName}` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 2000),
    );

    let embDone = 0;
    const logEmb = (done: number, total: number) => {
      embDone = done;
      const pct = 65 + Math.round((done / total) * 28);
      onProgress({
        status: "embedding",
        percentage: pct,
        message: `Embedded ${done} / ${total} chunks`,
        doneChunks: done,
        totalChunks: total,
      });
    };

    const [codeEmbeddings, contextEmbeddings] = await Promise.all([
      batchGenerateEmbeddings(codeTexts, (d, t) => logEmb(d, t * 2)),
      batchGenerateEmbeddings(contextTexts, (d, t) =>
        logEmb(embDone + d, t * 2),
      ),
    ]);

    // ── Phase 7: Persist embeddings into CodeChunk ───────────
    // Single-table write — codeEmbedding + contextEmbedding live on the
    // same row as the metadata. Vector dimension is vector(768) from schema.
    onProgress({
      status: "indexing",
      percentage: 95,
      message: "Persisting embeddings...",
    });

    await Promise.all(
      chunkRows.map(async (chunk, i) => {
        const codeEmb = codeEmbeddings[i];
        const ctxEmb = contextEmbeddings[i];

        const setClauses: string[] = [
          // Provenance — assertModelConsistency() reads this at query time
          `"embeddingModel" = '${ACTIVE_MODEL}'`,
          `"embeddingDim"   = ${ACTIVE_DIM}`,
          // Full-text search vector for keyword hybrid search
          `"searchVector"   = to_tsvector('english',
              COALESCE("rawCode", '')      || ' ' ||
              COALESCE("entityName", '')   || ' ' ||
              COALESCE(signature, ''))`,
        ];

        if (codeEmb) {
          setClauses.push(`"codeEmbedding" = '[${codeEmb.join(",")}]'::vector`);
        }
        if (ctxEmb) {
          setClauses.push(
            `"contextEmbedding" = '[${ctxEmb.join(",")}]'::vector`,
          );
        }

        if (codeEmb || ctxEmb) {
          await prisma.$executeRawUnsafe(
            `UPDATE "CodeChunk" SET ${setClauses.join(", ")} WHERE id = '${chunk.id}'`,
          );
        }
      }),
    );

    // ── Done ─────────────────────────────────────────────────
    await prisma.whizProject.update({
      where: { id: projectId },
      data: { status: "INDEXED", indexedAt: new Date() },
    });

    await updateJob(jobId, {
      status: "COMPLETED",
      phase: "done",
      progress: 100,
      doneChunks: createdIds.length,
      completedAt: new Date(),
    });

    onProgress({
      status: "done",
      percentage: 100,
      message: `Done! ${createdIds.length} chunks indexed.`,
      totalChunks: createdIds.length,
      doneChunks: createdIds.length,
    });
  } catch (err: unknown) {
    const message = (err as Error).message ?? "Unknown error";
    console.error("[Indexer] Fatal:", message);

    await updateJob(jobId, {
      status: "FAILED",
      phase: "failed",
      errorMessage: message,
      completedAt: new Date(),
    });

    await prisma.whizProject.update({
      where: { id: projectId },
      data: { status: "FAILED" },
    });

    onProgress({
      status: "failed",
      percentage: 0,
      message: "Indexing failed",
      error: message,
    });

    throw err;
  } finally {
    if (tempDir) {
      try {
        await rimraf(tempDir);
      } catch {
        /* ignore cleanup errors */
      }
    }
  }
}

// ─── Job helpers ─────────────────────────────────────────────

async function updateJob(
  jobId: string,
  data: {
    status?: "RUNNING" | "COMPLETED" | "FAILED";
    phase?: string;
    progress?: number;
    totalChunks?: number;
    doneChunks?: number;
    totalFiles?: number;
    doneFiles?: number;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  },
) {
  try {
    await prisma.indexingJob.update({
      where: { id: jobId },
      data,
    });
  } catch (err) {
    console.error("[Indexer] Failed to update job:", err);
  }
}
