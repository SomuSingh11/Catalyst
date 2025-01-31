import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  // Load the data from the JSON file
  const data = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "prisma", "leetCode.json"),
      "utf-8"
    )
  );

  for (const item of data) {
    await prisma.leetcodeQuestion.create({
      data: {
        name: item.Name,
        questionId: item["Question ID"],
        difficulty: item.Difficulty,
        tags: item["Question Tags"],
        companyTags: item["Company Tags"],
        questionURL: item["Question URL"],
        listTags: item["Question Lists Tags"],
        questionSlug: item["Quesiton Slug"],
        similarQuestions: item["Similar Questions"],
        leetCodePatterns: item["Sean Prashad LeetCode Patterns"],
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
