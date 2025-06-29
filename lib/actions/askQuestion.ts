"use server"; // Indicates this is a Next.js Server Action (Next.js 13+ / App Router)

import prisma from "@/lib/db";
import { streamText } from "ai"; // Used to stream LLM responses
import { createStreamableValue } from "ai/rsc"; // Create streamable value for RSC
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Google Gemini wrapper
import { generateEmbedding } from "@/lib/gemini"; // Custom function to generate vector embeddings from a question

// Initialize Gemini with API key from environment
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = await createStreamableValue();

  // Step 1: Convert question to a vector using Gemini Embedding API
  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  // Step 2: Find top 10 source code files most similar to the question vector
    const result = await prisma.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS "similarity"
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "whizProjectId" = ${projectId}
    ORDER BY "similarity" DESC 
    LIMIT 10
    ` as {
        fileName: string 
        sourceCode: string
        summary: string
    }[]


  // Step 3: Concatenate context from retrieved files
  let context = "";
  for (const doc of result) {
    context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary of file: ${doc.summary} \n\n `;
  }

  // Step 4: Use Gemini model to answer the question using the constructed context
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-2.0-flash"),
      prompt: `
        You are a AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is new to the codebase.
        ...
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK

        START QUESTION
        ${question}
        END OF QUESTION
        ...
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