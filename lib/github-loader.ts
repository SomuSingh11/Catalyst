// Importing the GithubRepoLoader from Langchain's community package.
// This loader helps fetch the content of a GitHub repository and convert it into a format
// that can be used for LLM processing (like summarization, QA, indexing, etc.)

import prisma from "@/lib/db";

import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "@/lib/gemini";

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || "",
        branch: "main",
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })

    const docs = await loader.load();
    return docs;
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`);
        if(!embedding) {
            return;
        }

        const sourceCodeEmbedding = await prisma?.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                whizProjectId: projectId,
            }
        })

        await prisma.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

const generateEmbeddings = async ( docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))
}