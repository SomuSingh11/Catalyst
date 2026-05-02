import { GoogleGenAI } from "@google/genai";

if(!process.env.GOOGLE_GEMINI_KEY) {
  throw new Error("Google_GEMINI_KEY environment variable is required")
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY ?? "",
});

const FLASH_MODEL = "gemini-3.1-flash-lite-preview";
const EMBEDDING_MODEL = "text-embedding-001";


// ─── Rate limit state ────────────────────────────────────────
// Free tier: 15 RPM for generation, 1500 RPD for embedding
// We track calls and back off when needed

interface RateLimitState {
  calls: number[],        // timestamps of recent calls
  rpm: number,            // max requests per minute
  minDelayMs: number      // minimum delay between calls
}

// Separate rate limit configs for different API types
const genState: RateLimitState = {calls: [], rpm: 14, minDelayMs: 4500};
const embState: RateLimitState = {calls: [], rpm: 100, minDelayMs: 650};

// ─── Helper: Remove outdated calls ───────────────────────────
function pruneOldCalls(state: RateLimitState) {
  const cutoff = Date.now() - 60_000;
  state.calls = state.calls.filter((t) => t > cutoff);
}


// ─── Core: Wait until it's safe to make a request ─────────────
// This function enforces BOTH:
// 1. Max requests per minute (RPM)
// 2. Minimum delay between consecutive calls

async function waitForSlot(state: RateLimitState) {
  // Step 1: Clean up the old calls
  pruneOldCalls(state);
  
  // Step 2: Check if we've hit the per-minute limit
  if(state.calls.length >= state.rpm) {
    // Oldest request in the current 1-minute window
    const oldest = state.calls[0];
    const waitMs = 60_000 - (Date.now() - oldest) + 200;
    if(waitMs > 0) {
      console.log(`[Gemini] Rate limit: waiting ${waitMs}ms`);
      await sleep(waitMs);
    }
    pruneOldCalls(state);
  }

  // Enforce minimum inter-call delay
  if(state.calls.length > 0) {
    const lastCall = state.calls[state.calls.length-1]!;
    const elapsed = Date.now() - lastCall;
    if (elapsed < state.minDelayMs) {
      await sleep(state.minDelayMs - elapsed);
    }
  }
  state.calls.push(Date.now());
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// ─── Retry wrapper ───────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 4,
  baseDelay = 2000
): Promise<T> {
  for(let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isLastAttempt = attempt == retries;
      const err = error as {status?: number; message?: string};

      // Don't retry on non-retryable errors
      if(err?.status === 400 || err?.status === 404) throw err;
      if(isLastAttempt) throw err;

      // Exponential backoff with jitter
      const delay = baseDelay + Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(
        `[Gemini] Attempt ${attempt + 1} failed: ${err?.message}. Retrying in ${Math.round(delay)}ms`
      );
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
}


// ─── Embedding ───────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  // Truncate to 8000 character to stay within the token limits
  const truncated = text.slice(0, 8000);
  await waitForSlot(embState);

  return withRetry(async() => {
    const result = await genAI.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: truncated,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768
      }
    });

    return result.embeddings![0].values!;
  });
};

/**
 * Batch embed multiple texts. Processes in groups to respect rate limits.
 * Returns embeddings in the same order as input.
 */

export async function batchGenerateEmbeddings(
  texts: string[],
  onProgress: (done: number, total: number) => void
): Promise<Array<number[] | null>> {
  const results: Array<number[] | null> = new Array(texts.length).fill(null);
  const BATCH_SIZE = 10;

  for(let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i+BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((text) => generateEmbedding(text))
    );

    batchResults.forEach((result, idx) => {
      if(result.status === "fulfilled") {
        results[i + idx] = result.value;
      } else {
        console.error(`[Embedding] Failed for index ${i + idx}:`, result.reason);
        results[i + idx] = null;
      }
    });

    onProgress?.(Math.min(i + BATCH_SIZE, texts.length), texts.length);
  }

  return results;
}


// ─── Chunk summarization ───────────────────────────────────────────────

export async function summariseChunk(input: 
  {
    filePath: string;
    language: string;
    chunkType: string;
    entityName?: string;
    rawCode: string;
    signature?: string
  }
): Promise<string> {
  const {filePath, language, chunkType, entityName, rawCode, signature} = input;

  // Only summarize meaningful chunk types — skip imports/constants
  if(chunkType === "IMPORT_GROUP" || chunkType === "CONSTANT") {
    return signature || rawCode.slice(0, 200);
  }

  await waitForSlot(genState);

  return withRetry(async() => {
    const prompt =buildChunkSummaryPrompt({
      filePath,
      language,
      chunkType,
      entityName,
      rawCode: rawCode.slice(0, 4000),
      signature
    });

    const result = await genAI.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt
    });


    return result?.text?.trim() || "";
  });
}

function buildChunkSummaryPrompt(input: {
  filePath: string;
  language: string;
  chunkType: string;
  entityName?: string;
  rawCode: string;
  signature?: string;
}): string {
  return `You are a code analysis AI. Write a concise technical summary of this ${input.chunkType.toLowerCase()} from ${input.filePath}.
 
  ${input.signature ? `Signature: ${input.signature}\n` : ""}
  Language: ${input.language}
  ${input.entityName ? `Name: ${input.entityName}\n` : ""}
  
  Source:
  \`\`\`${input.language}
  ${input.rawCode}
  \`\`\`
  
  Write 2-4 sentences covering:
  1. What this ${input.chunkType.toLowerCase()} does
  2. Key parameters/inputs and what it returns or produces
  3. Important side effects, dependencies, or patterns used
  4. When a developer would use or modify this
  
  Be precise. Use technical terminology. Include the actual function/class name in your response.
  No markdown headers. Plain paragraph.`;
}


// ─── File-level summary (for FILE_SUMMARY chunks) ────────────
 
export async function summarizeFile(input: {
  filePath: string;
  language: string;
  entities: Array<{ name: string; type: string; signature?: string }>;
  rawCode: string;
}): Promise<string> {
  await waitForSlot(genState);
 
  const entityList = input.entities
    .slice(0, 20)
    .map((e) => `- ${e.type}: ${e.name}${e.signature ? ` (${e.signature})` : ""}`)
    .join("\n");
 
  return withRetry(async () => {
    const result = await genAI.models.generateContent({
      model: FLASH_MODEL,
      contents: `Summarize this source file for a developer knowledge base.
 
    File: ${input.filePath}
    Language: ${input.language}
    
    Exported entities:
    ${entityList}
    
    Code preview (first 2000 chars):
    \`\`\`
    ${input.rawCode.slice(0, 2000)}
    \`\`\`
    
    Write 3-5 sentences covering:
    1. The file's primary responsibility in the application
    2. The most important exports and what they do
    3. Key dependencies and integration points
    4. Common scenarios where a developer would look at this file
    
    Be specific, use the actual names. Plain paragraph, no markdown.`
    });
    return result.text?.trim() || "";
  });
}


 
// ─── Commit summarization (improved) ─────────────────────────
 
export async function summarizeCommit(diff: string): Promise<{
  summary: string;
  commitType: string;
  impactScore: number;
  changedFiles: string[];
}> {
  await waitForSlot(genState);
 
  // Extract changed files from diff header lines
  const changedFiles = Array.from(
    diff.matchAll(/^diff --git a\/.+ b\/(.+)$/gm),
    (m) => m[1]
  ).filter(Boolean) as string[];
 
  const truncatedDiff = diff.slice(0, 6000);
 
  return withRetry(async () => {
    const result = await genAI.models.generateContent({
      model: FLASH_MODEL,
      contents: `Analyze this git diff and respond with ONLY valid JSON, no markdown.
 
  Diff:
  ${truncatedDiff}
  
  Respond with exactly this JSON structure:
  {
    "summary": "2-3 sentence technical summary of what changed and why",
    "commitType": "feat|fix|refactor|docs|test|chore|perf",
    "impactScore": <integer 1-10 where 10 is most impactful>,
    "keyChanges": ["change 1", "change 2", "change 3"]
  }
  
  impactScore guide: 1-2=typo/comment, 3-4=minor fix, 5-6=feature addition, 7-8=significant refactor, 9-10=breaking change or major feature`
    });
 
    const text = result.text?.trim() || "";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
 
    try {
      const parsed = JSON.parse(cleaned);
      return {
        summary: parsed.summary || "No summary available",
        commitType: parsed.commitType || "chore",
        impactScore: Math.min(10, Math.max(1, parsed.impactScore || 5)),
        changedFiles,
      };
    } catch {
      // If JSON parse fails, return a safe default
      return {
        summary: text.slice(0, 500),
        commitType: "chore",
        impactScore: 5,
        changedFiles,
      };
    }
  });
}


// ─── Quiz question generation (context-aware) ────────────────
 
export interface QuizQuestion {
  question: string;
  answer: string;
  option1?: string;
  option2?: string;
  option3?: string;
  codeSnippet?: string;
  explanation: string;
  conceptTags: string[];
  difficulty: number;
  sourceChunkIds: string[];
}
 
export async function generateContextAwareQuestions(input: {
  type: "mcq" | "open_ended";
  amount: number;
  topic: string;
  codeContext: string; // assembled from RAG
  sourceChunkIds: string[];
  weakConcepts?: string[];
  difficulty?: number;
}): Promise<QuizQuestion[]> {
  await waitForSlot(genState);
 
  const { type, amount, topic, codeContext, weakConcepts, difficulty = 2 } =
    input;
 
  const weakConceptsNote =
    weakConcepts && weakConcepts.length > 0
      ? `\nFocus extra attention on these concepts where the user has shown weakness: ${weakConcepts.slice(0, 5).join(", ")}`
      : "";
 
  const questionFormat =
    type === "mcq"
      ? `{
  "question": "question text — reference specific function/variable names from the code",
  "answer": "correct answer (max 15 words)",
  "option1": "wrong option 1",
  "option2": "wrong option 2",
  "option3": "wrong option 3",
  "codeSnippet": "relevant 3-8 line code excerpt if helpful, else null",
  "explanation": "why the answer is correct, referencing the code",
  "conceptTags": ["tag1", "tag2"],
  "difficulty": ${difficulty}
}`
      : `{
  "question": "open-ended question about the code",
  "answer": "expected answer (max 20 words)",
  "codeSnippet": "relevant code excerpt if helpful, else null",
  "explanation": "detailed explanation of the concept",
  "conceptTags": ["tag1", "tag2"],
  "difficulty": ${difficulty}
}`;
 
  return withRetry(async () => {
    const result = await genAI.models.generateContent({
      model: FLASH_MODEL,
      contents: `You are an expert programming educator creating questions grounded in real code.
 
Topic: ${topic}
Difficulty: ${difficulty}/5 (1=beginner, 5=expert)${weakConceptsNote}
 
CODEBASE CONTEXT (use this to create grounded questions):
${codeContext}
 
Generate exactly ${amount} ${type === "mcq" ? "multiple choice" : "open-ended"} questions about this codebase.
 
Rules:
- Questions MUST reference actual functions, components, patterns, or logic from the provided code context
- Do not make up code that isn't in the context
- MCQ wrong options should be plausible but clearly incorrect when you understand the code
- conceptTags should be 2-4 short strings like ["React hooks", "useState", "side effects"]
- difficulty must be ${difficulty}
 
Respond with ONLY a JSON array, no markdown:
[${questionFormat}, ...]`
    });
 
    const text = result.text?.trim() || "";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
 
    const parsed = JSON.parse(cleaned);
    const questions: QuizQuestion[] = Array.isArray(parsed) ? parsed : [parsed];
 
    return questions.map((q) => ({
      ...q,
      sourceChunkIds: input.sourceChunkIds,
      difficulty: input.difficulty ?? 2,
      conceptTags: Array.isArray(q.conceptTags) ? q.conceptTags : [],
      explanation: q.explanation || "",
    }));
  });
}
 
// ─── Semantic answer scoring (replaces string-similarity) ────
 
export async function scoreAnswerSemantically(
  correctAnswer: string,
  userAnswer: string
): Promise<number> {
  if (!userAnswer.trim()) return 0;
 
  const [correctEmb, userEmb] = await Promise.all([
    generateEmbedding(correctAnswer),
    generateEmbedding(userAnswer),
  ]);
 
  return cosineSimilarity(correctEmb, userEmb);
}
 
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : Math.max(0, Math.min(1, dot / denom));
}
 
// ─── RAG answer generation ────────────────────────────────────
 
export async function generateRagAnswer(
  question: string,
  context: string,
  onChunk?: (text: string) => void
): Promise<string> {
  await waitForSlot(genState);
 
  const prompt = `You are GitWhiz, an AI code assistant. Answer the developer's question using ONLY the provided codebase context. Be precise and reference actual file names, function names, and line patterns from the context.
 
If the answer is not in the context, say "I couldn't find relevant code for this in the indexed files."
 
CODEBASE CONTEXT:
${context}
 
QUESTION: ${question}
 
Provide a clear, structured answer with:
1. Direct answer to the question
2. Relevant code references (file paths and function names)
3. How the pieces connect
 
Use markdown formatting.`;
 
  if (onChunk) {
    // Streaming mode
    return withRetry(async () => {
      const result = await genAI.models.generateContentStream({
        model: FLASH_MODEL,
        contents: prompt
      });
      let fullText = "";
      for await (const chunk of result) {
        const text = chunk.text || "";
        fullText += text;
        onChunk(text);
      }
      return fullText;
    });
  } else {
    return withRetry(async () => {
      const result = await genAI.models.generateContent({
        model: FLASH_MODEL,
        contents: prompt
      });
      return result.text || "";
    });
  }
}



