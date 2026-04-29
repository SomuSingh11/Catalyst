"use server"; // Indicates this is a Next.js Server Action (Next.js 13+ / App Router)

import prisma from "@/lib/db";
import { streamText } from "ai"; // Used to stream LLM responses
import { createStreamableValue } from "ai/rsc"; // Create streamable value for RSC
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Google Gemini wrapper
// import { generateEmbedding } from "@/lib/services/gemini"; // Custom function to generate vector embeddings from a question
import { GoogleGenAI } from "@google/genai";

const genAINew = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY ?? "",
});

// Initialize Gemini with API key from environment
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = await createStreamableValue();

  // Step 1: Convert question to a vector using Gemini Embedding API

  // Use RETRIEVAL_QUERY for questions (different task type than documents)
  const response = await genAINew.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
    config: {
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: 768,
    },
  });

  const queryVector = response.embeddings![0].values!;
  const vectorQuery = `[${queryVector.join(",")}]`;

  // Step 2: Find top 10 source code files most similar to the question vector
  const result = (await prisma.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS "similarity"
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.6
    AND "whizProjectId" = ${projectId}
    ORDER BY "similarity" DESC 
    LIMIT 10
    `) as {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];

  // Step 3: Concatenate context from retrieved files
  let context = "";
  for (const doc of result) {
    context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary of file: ${doc.summary} \n\n `;
  }

  // Step 4: Use Gemini model to answer the question using the constructed context
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-3.1-flash-lite-preview"), // Using Gemini 3.1 Flash model //"gemini-3.1-flash-lite-preview"
      prompt: `
You are an expert software engineer helping a junior developer understand a codebase.

----------------------------------------
🛑 RULES
----------------------------------------
- Use the provided context as the primary source
- If something is missing, say so clearly and then explain generally
- Do NOT hallucinate code that is not present

----------------------------------------
🧠 STYLE
----------------------------------------
- Answer naturally like a senior developer explaining code
- Start with a direct answer in 1–2 sentences
- Then explain step-by-step how the code works
- Mention file names, functions, and flow naturally in the explanation
- Include small code snippets ONLY when helpful
- Keep the explanation detailed but easy to follow

----------------------------------------
📦 CONTEXT
----------------------------------------
${context}

----------------------------------------
❓ QUESTION
----------------------------------------
${question}
`,
    });

    // Stream the response to the UI
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  // Step 5: Return both the stream and the matched file metadata
  return {
    output: stream.value,
    filesReferences: result,
  };
}

// This server action performs the following:

// Generates an embedding of a natural language question using Google Gemini.
// Queries a PostgreSQL database (via Prisma) for the top 10 source code files with similar semantic embeddings.
// Constructs a context block combining source code and summaries of those files.
// Streams a detailed AI response using ai-sdk + Gemini 2.0 Flash, tailored for a technical intern audience.
// Returns the AI response stream and the list of matched files for reference
