/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from "@langchain/core/documents";
import path from "path";
import fs from "fs/promises";
import simpleGit from "simple-git";
import { rimraf } from "rimraf";
import { generateEmbedding, summariseCode } from "../services/gemini";
import prisma from "@/lib/db";
import { IndexingProgress } from "@/types/gitWhiz";

// --- A simple delay helper ---
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry a promise-returning function with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      console.log(
        `Retrying in ${delay / 1000}s... (${retries} retries left) - ${
          error.message
        }`
      );
      await new Promise((res) => setTimeout(res, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    } else {
      console.error("Max retries reached. Operation failed.", error);
      throw error;
    }
  }
};

// --- Helper: Retry logic with exponential backoff ---
const shouldIgnoreFile = (filePath: string, fileName: string): boolean => {
  // Directories to ignore
  const ignoreDirs = [
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
  ];

  // File patterns to ignore
  const ignorePatterns = [
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

  const pathParts = filePath.split(path.sep);
  if (pathParts.some((part) => ignoreDirs.includes(part))) {
    return true;
  }

  return ignorePatterns.some((pattern) => pattern.test(fileName));
};

// --- Check if file is likely to be code ---
const isCodeFile = (fileName: string): boolean => {
  const codeExtensions = [
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
    ".txt",
    ".dockerfile",
    ".makefile",
    ".gradle",
    ".maven",
  ];

  const ext = path.extname(fileName).toLowerCase();
  return (
    codeExtensions.includes(ext) ||
    ["dockerfile", "makefile", "readme"].some((name) =>
      fileName.toLowerCase().includes(name)
    )
  );
};

// --- Step 1: Clone repo and load files from local disk ---
const loadRepoFilesLocally = async (
  githubUrl: string,
  onProgress: (progress: IndexingProgress) => void
): Promise<Document[]> => {
  const tempDir = await fs.mkdtemp(path.join(process.cwd(), "temp-repo-"));
  console.log(`Cloning ${githubUrl} into ${tempDir}...`);

  onProgress({
    status: "cloning",
    message: `Cloning repository: ${githubUrl}`,
    percentage: 5,
  });

  try {
    const git = simpleGit();

    await git.clone(githubUrl, tempDir, ["--depth", "1"]);

    console.log(`Successfully cloned repository`);
    onProgress({
      status: "cloning",
      message: "Repository cloned successfully, analyzing files...",
      percentage: 15,
    });

    const documents: Document[] = [];
    let totalFiles = 0;
    let processedFiles = 0;
    let skippedFiles = 0;

    // Recursively read files from the cloned directory
    const readFiles = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(tempDir, fullPath);

        totalFiles++;

        if (shouldIgnoreFile(relativePath, entry.name)) {
          skippedFiles++;
          console.log(`Skipping ignored file: ${relativePath}`);
          continue;
        }

        if (entry.isDirectory()) {
          await readFiles(fullPath);
        } else {
          if (!isCodeFile(entry.name)) {
            skippedFiles++;
            console.log(`Skipping non-code file: ${relativePath}`);
            continue;
          }

          try {
            const content = await fs.readFile(fullPath, "utf-8");

            // Skip very large files (>100KB) and very small files (<10 chars)
            if (content.length > 100000) {
              skippedFiles++;
              console.log(`Skipping large file: ${relativePath}`);
              continue;
            } else if (content.length < 10) {
              skippedFiles++;
              console.log(`Skipping tiny file: ${relativePath}`);
              continue;
            } else {
              documents.push(
                new Document({
                  pageContent: content,
                  metadata: {
                    source: relativePath,
                    size: content.length,
                    extension: path.extname(entry.name),
                  },
                })
              );
              processedFiles++;
              console.log(
                `✅ Added: ${relativePath} (${content.length} chars)`
              );
            }
          } catch (error) {
            console.log(`❌ Error reading ${relativePath}: ${error}`);
            skippedFiles++;
          }
        }
      }
    };

    await readFiles(tempDir);

    console.log(`\n📊 File processing summary:`);
    console.log(`   Total files found: ${totalFiles}`);
    console.log(`   Code files processed: ${processedFiles}`);
    console.log(`   Files skipped: ${skippedFiles}`);

    onProgress({
      status: "processing",
      message: `Found ${processedFiles} code files to process (${skippedFiles} skipped)`,
      total: processedFiles,
      current: 0,
      percentage: 20,
    });

    return documents;
  } catch (error) {
    console.error("Failed to clone or read repo:", error);

    if (error && typeof error === "object" && "message" in error) {
      const errorMsg = (error as any).message.toLowerCase();
      if (
        errorMsg.includes("authentication") ||
        errorMsg.includes("permission")
      ) {
        throw new Error(
          `Authentication failed. This might be a private repository. Please provide a GitHub token with access to this repo.`
        );
      }
    }

    return [];
  } finally {
    // Clean up the temporary directory
    try {
      await rimraf(tempDir);
      console.log(`🧹 Cleaned up temporary directory: ${tempDir}`);
    } catch (error) {
      console.warn(
        `⚠️  Failed to clean up temp directory: ${tempDir} : ${
          (error as any).message
        }`
      );
    }
  }
};

// --- Step 2: Process files sequentially with retries and rate limiting ---
const generateEmbeddings = async (
  docs: Document[],
  onProgress: (progress: IndexingProgress) => void
) => {
  console.log(
    `\n🔄 Starting to process ${docs.length} files for embeddings...`
  );

  const embeddings = [];
  // const delayPerFile = 2400; // 2.4 seconds delay to respect rate limits
  const total = docs.length;

  for (const [index, doc] of docs.entries()) {
    const progress = `[${index + 1}/${docs.length}]`;
    const current = index + 1;
    const basePercentage = 20; // Starting after file discovery
    const processingRange = 60; // 20% to 80% for processing
    const percentage =
      basePercentage + Math.round((current / total) * processingRange);

    console.log(`${progress} Processing: ${doc.metadata.source}`);

    onProgress({
      status: "processing",
      message: `Processing file ${current} of ${total}`,
      current,
      total,
      currentFile: doc.metadata.source,
      percentage,
    });

    try {
      const processFile = async () => {
        const summary = await summariseCode(doc);
        await delay(5000);
        const embedding = await generateEmbedding(summary);
        await delay(50);

        return {
          summary,
          embedding,
          sourceCode: doc.pageContent,
          metadata: doc.metadata,
        };
      };

      const result = await retryWithBackoff(processFile, 3, 2000);
      embeddings.push(result);

      console.log(`✅ ${progress} Completed: ${doc.metadata.source}`);
    } catch (error: any) {
      console.error(
        `❌ ${progress} Failed to process ${doc.metadata.source}: ${error.message}`
      );
      embeddings.push(null);
    }

    // await new Promise((res) => setTimeout(res, delayPerFile));
  }

  const successfull = embeddings.filter((e) => e !== null).length;
  const failed = embeddings.filter((e) => e === null).length;

  console.log(
    `\n📊 Current summary: Success: ${successfull}, Failed: ${failed}\n`
  );
  onProgress({
    status: "saving",
    message: `Generated ${successfull} embeddings (${failed} failed). Starting database save...`,
    current: successfull,
    total: docs.length,
    percentage: 80,
  });

  return embeddings.filter((e) => e !== null);
};

// --- Step 3: Save to database with better error handling ---
const saveEmbeddingsToDB = async (
  embeddings: any[],
  projectId: string,
  onProgress: (progress: IndexingProgress) => void
) => {
  console.log(`\n💾 Saving ${embeddings.length} embeddings to database...`);

  let savedCount = 0;
  let failedCount = 0;
  const total = embeddings.length;

  for (const [index, embedding] of embeddings.entries()) {
    const current = index + 1;
    const basePercentage = 80; // Starting after processing
    const savingRange = 15; // 80% to 95% for saving
    const percentage =
      basePercentage + Math.round((current / total) * savingRange);

    // Update progress every 3 saves or on last item
    if (current % 3 === 0 || current === total) {
      onProgress({
        status: "saving",
        message: `Saving to database: ${
          savedCount + failedCount
        } of ${total} processed`,
        current: savedCount + failedCount,
        total,
        currentFile: embedding.metadata.source,
        percentage,
      });
    }
    try {
      const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.metadata.source,
          whizProjectId: projectId,
        },
      });

      await prisma.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
      `;

      savedCount++;
      console.log(
        `✅ [${index + 1}/${embeddings.length}] Saved: ${
          embedding.metadata.source
        }`
      );
    } catch (error: any) {
      failedCount++;
      console.error(
        `❌ [${index + 1}/${embeddings.length}] Failed to save ${
          embedding?.metadata?.source ?? "unknown"
        }: ${error.message}`
      );
    }
  }

  console.log(`\n📊 Database save summary:`);
  console.log(`   Successfully saved: ${savedCount}`);
  console.log(`   Failed to save: ${failedCount}`);

  return { savedCount, failedCount };
};

// --- Main indexing function with Server Sent Events ---
export const indexGithubRepoWithSSE = async (
  projectId: string,
  githubUrl: string,
  onProgress: (progress: IndexingProgress) => void
) => {
  console.log(`Starting GitWhiz Indexing Engine for: ${githubUrl}`);
  const overallStartTime = Date.now();

  try {
    // Update database status to processing
    await prisma.whizProject.update({
      where: { id: projectId },
      data: { status: "processing" },
    });

    onProgress({
      status: "initialising",
      message: "Starting repository indexing...",
      percentage: 0,
    });

    // 1. Clone repo and load files
    const docs = await loadRepoFilesLocally(githubUrl, onProgress);
    if (docs.length === 0) {
      console.log("No documents found or failed to load repository");
      return {
        success: false,
        error: "No documents found or failed to load repository",
      };
    }

    // 2. Generate summaries and embeddings sequentially
    const allEmbeddings = await generateEmbeddings(docs, onProgress);
    if (allEmbeddings.length === 0) {
      console.log("Failed to generate any embeddings");
      return { success: false, error: "Failed to generate any embeddings" };
    }

    // 3. Save embeddings to database
    const { savedCount, failedCount } = await saveEmbeddingsToDB(
      allEmbeddings,
      projectId,
      onProgress
    );

    // Update database status to completed
    await prisma.whizProject.update({
      where: { id: projectId },
      data: {
        status: "completed",
      },
    });

    const totalTime = (Date.now() - overallStartTime) / 1000;

    console.log(`\n🎉 Indexing complete!`);
    console.log(`   Total time: ${totalTime.toFixed(1)}s`);
    console.log(`   Files processed: ${docs.length}`);
    console.log(`   Embeddings generated: ${allEmbeddings.length}`);
    console.log(`   Successfully saved: ${savedCount}`);
    console.log(`   Failed saves: ${failedCount}`);

    // Final success update
    onProgress({
      status: "completed",
      message: `Indexing completed! Processed ${savedCount} files in ${totalTime.toFixed(
        1
      )}s`,
      current: savedCount,
      total: docs.length,
      percentage: 100,
    });

    return {
      success: true,
      stats: {
        totalFiles: docs.length,
        embeddingsGenerated: allEmbeddings.length,
        savedToDatabase: savedCount,
        failed: failedCount,
        processingTimeSeconds: totalTime,
      },
    };
  } catch (error) {
    console.error("❌ Indexing failed:", error);
    // Update database status to failed
    await prisma.whizProject.update({
      where: { id: projectId },
      data: {
        status: "failed",
      },
    });

    // Send error progress update
    onProgress({
      status: "error",
      message: "Indexing failed",
      error: (error as any).message,
      percentage: 0,
    });
    return {
      success: false,
      error: (error as any).message,
      stats: null,
    };
  }
};
