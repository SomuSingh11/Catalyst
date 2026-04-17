/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Project-wise Embedding Reindex Script
 *
 * Usage:
 *   Reindex ALL projects:
 *     npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/reindex-project-embeddings.ts
 *
 *   Reindex a SPECIFIC project by ID:
 *     npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/reindex-project-embeddings.ts --project <projectId>
 *
 *   DRY RUN (just list projects and record counts, no changes):
 *     npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/reindex-project-embeddings.ts --dry-run
 *
 *   Reindex specific project with dry run:
 *     npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/reindex-project-embeddings.ts --project <projectId> --dry-run
 */

import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// ─── Config ──────────────────────────────────────────────────────────────────

const BATCH_SIZE = 1; // records per API call (max 250, keep at 50 to be safe)
const DELAY_BETWEEN_BATCHES = 1000; // ms between batches (stay under RPM)
const RETRY_DELAY = 60000; // ms to wait after a 429 before retrying

// ─── Init ─────────────────────────────────────────────────────────────────────

const prisma = new PrismaClient();

const apiKey = process.env.GOOGLE_GEMINI_KEY;
if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_KEY is not set in your .env / .env.local");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const projectIndex = args.indexOf("--project");
  const projectId = projectIndex !== -1 ? args[projectIndex + 1] : null;
  const isDryRun = args.includes("--dry-run");
  return { projectId, isDryRun };
}

async function generateEmbeddingsBatch(
  summaries: string[],
): Promise<number[][]> {
  const response = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: summaries,
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 768, // matches your vector(768) Prisma schema
    },
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("No embeddings returned from API");
  }

  return response.embeddings.map((e) => e.values ?? []);
}

// ─── Per-Project Reindex ──────────────────────────────────────────────────────

async function reindexProject(
  projectId: string,
  projectName: string,
  isDryRun: boolean,
): Promise<{ success: number; failed: number; skipped: number }> {
  const records = await prisma.sourceCodeEmbedding.findMany({
    where: { whizProjectId: projectId },
    select: { id: true, summary: true, fileName: true },
    orderBy: { fileName: "asc" },
  });

  const total = records.length;

  if (total === 0) {
    console.log(`   ⚠️  No embeddings found for this project.`);
    return { success: 0, failed: 0, skipped: 0 };
  }

  console.log(`   📂 ${total} files to reindex`);

  if (isDryRun) {
    console.log(`   🔍 DRY RUN — no changes will be made`);
    records
      .slice(0, 5)
      .forEach((r) =>
        console.log(
          `      - ${r.fileName} (summary: ${r.summary?.length ?? 0} chars)`,
        ),
      );
    if (total > 5) console.log(`      ... and ${total - 5} more`);
    return { success: 0, failed: 0, skipped: total };
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;
  const totalBatches = Math.ceil(total / BATCH_SIZE);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    process.stdout.write(
      `   Batch ${batchNum}/${totalBatches} (${batch.length} files)... `,
    );

    // Filter out records with no summary
    const validBatch = batch.filter(
      (r) => r.summary && r.summary.trim().length > 0,
    );
    const emptyCount = batch.length - validBatch.length;

    if (emptyCount > 0) {
      skipped += emptyCount;
      console.log(`\n   ⚠️  Skipping ${emptyCount} records with no summary`);
    }

    if (validBatch.length === 0) {
      console.log("all skipped.");
      continue;
    }

    // Attempt embedding with one retry on rate limit
    let vectors: number[][] | null = null;
    let attempts = 0;

    while (attempts < 2) {
      try {
        vectors = await generateEmbeddingsBatch(
          validBatch.map((r) => r.summary!),
        );
        break;
      } catch (err: any) {
        const isRateLimit =
          err?.message?.includes("429") ||
          err?.message?.includes("RESOURCE_EXHAUSTED");

        if (isRateLimit && attempts === 0) {
          console.log(
            `\n   ⏳ Rate limited. Waiting ${RETRY_DELAY / 1000}s before retry...`,
          );
          await sleep(RETRY_DELAY);
          attempts++;
        } else {
          console.log(`\n   ❌ API error: ${err.message}`);
          failed += validBatch.length;
          vectors = null;
          break;
        }
      }
    }

    if (!vectors) continue;

    // Save each embedding to DB
    let batchSuccess = 0;
    for (let j = 0; j < validBatch.length; j++) {
      const record = validBatch[j];
      const vector = vectors[j];

      if (!vector || vector.length === 0) {
        failed++;
        continue;
      }

      try {
        await prisma.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${`[${vector.join(",")}]`}::vector
          WHERE "id" = ${record.id}
        `;
        success++;
        batchSuccess++;
      } catch (dbErr: any) {
        failed++;
        console.log(
          `\n   ❌ DB update failed for ${record.fileName}: ${dbErr.message}`,
        );
      }
    }

    console.log(`✅ ${batchSuccess}/${validBatch.length} saved`);

    // Delay between batches (skip delay after the last batch)
    if (i + BATCH_SIZE < records.length) {
      process.stdout.write(
        `   ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`,
      );
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  return { success, failed, skipped };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { projectId: targetProjectId, isDryRun } = parseArgs();

  console.log("\n🚀 Catalyst — Project Embedding Reindex");
  console.log("=========================================");
  if (isDryRun) console.log("🔍 MODE: Dry Run (no changes will be made)\n");
  else console.log("✏️  MODE: Live (embeddings will be updated)\n");

  // Fetch projects to reindex
  const whereClause = targetProjectId
    ? { id: targetProjectId, deletedAt: null }
    : { deletedAt: null };

  const projects = await prisma.whizProject.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      githubUrl: true,
      _count: { select: { sourceCodeEmbeddings: true } },
    },
    orderBy: { name: "asc" },
  });

  if (projects.length === 0) {
    if (targetProjectId) {
      console.error(`❌ No project found with ID: ${targetProjectId}`);
      console.error("   Run without --project to list all available projects.");
    } else {
      console.log("⚠️  No projects found in the database.");
    }
    return;
  }

  // Summary table
  console.log("Projects to reindex:");
  console.log("─────────────────────────────────────────────────────");
  projects.forEach((p, i) => {
    console.log(
      `  ${i + 1}. ${p.name.padEnd(30)} ${String(p._count.sourceCodeEmbeddings).padStart(4)} files  [${p.id}]`,
    );
  });
  console.log("─────────────────────────────────────────────────────\n");

  // Reindex each project
  const overallStats = { success: 0, failed: 0, skipped: 0 };
  const startTime = Date.now();

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(
      `\n[${i + 1}/${projects.length}] Reindexing: "${project.name}"`,
    );
    console.log(`   ID:  ${project.id}`);
    console.log(`   URL: ${project.githubUrl}`);

    const stats = await reindexProject(project.id, project.name, isDryRun);

    overallStats.success += stats.success;
    overallStats.failed += stats.failed;
    overallStats.skipped += stats.skipped;

    console.log(
      `   Result: ✅ ${stats.success} updated | ❌ ${stats.failed} failed | ⏭️  ${stats.skipped} skipped`,
    );

    // Small gap between projects
    if (i < projects.length - 1 && !isDryRun) {
      await sleep(2000);
    }
  }

  // Final summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n=========================================");
  console.log("✅ Reindex Complete");
  console.log(`   Projects processed : ${projects.length}`);
  console.log(`   Total updated      : ${overallStats.success}`);
  console.log(`   Total failed       : ${overallStats.failed}`);
  console.log(`   Total skipped      : ${overallStats.skipped}`);
  console.log(`   Time elapsed       : ${elapsed}s`);
  console.log("=========================================\n");

  if (overallStats.failed > 0) {
    console.log(
      "⚠️  Some records failed. Re-run the script to retry — successful records won't be re-processed if you add tracking, or just run it again (re-embedding is idempotent).\n",
    );
  }
}

main()
  .catch((err) => {
    console.error("\n❌ Fatal error:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
