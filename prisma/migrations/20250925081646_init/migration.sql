-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('mcq', 'open_ended');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 150,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leetcodeQuestion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "companyTags" TEXT NOT NULL,
    "questionURL" TEXT NOT NULL,
    "listTags" TEXT NOT NULL,
    "questionSlug" TEXT NOT NULL,
    "similarQuestions" TEXT NOT NULL,
    "leetCodePatterns" TEXT NOT NULL,

    CONSTRAINT "leetcodeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizzy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "topic" TEXT NOT NULL,
    "timeStarted" TIMESTAMP(3) NOT NULL,
    "timeEnded" TIMESTAMP(3),

    CONSTRAINT "Quizzy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizzyQuestion" (
    "id" TEXT NOT NULL,
    "quizzyId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "options" JSONB,
    "percentageCorrect" DOUBLE PRECISION,
    "questionType" "GameType" NOT NULL,
    "userAnswer" TEXT,
    "isCorrect" BOOLEAN,

    CONSTRAINT "QuizzyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhizProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "githubToken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WhizProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "whizProjectId" TEXT NOT NULL,

    CONSTRAINT "UserToProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceCodeEmbedding" (
    "id" TEXT NOT NULL,
    "summaryEmbedding" vector(768),
    "sourceCode" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "whizProjectId" TEXT NOT NULL,

    CONSTRAINT "SourceCodeEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhizCommit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "whizProjectId" TEXT NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "commitAuthorName" TEXT NOT NULL,
    "commitAuthorAvatar" TEXT NOT NULL,
    "commitDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "WhizCommit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhizSavedQuestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "filesReferences" JSONB,
    "whizProjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WhizSavedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "leetcodeQuestion_questionId_key" ON "leetcodeQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_questionId_key" ON "UserProgress"("userId", "questionId");

-- CreateIndex
CREATE INDEX "userId" ON "Quizzy"("userId");

-- CreateIndex
CREATE INDEX "quizzyId" ON "QuizzyQuestion"("quizzyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserToProject_userId_whizProjectId_key" ON "UserToProject"("userId", "whizProjectId");

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "leetcodeQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizzy" ADD CONSTRAINT "Quizzy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzyQuestion" ADD CONSTRAINT "QuizzyQuestion_quizzyId_fkey" FOREIGN KEY ("quizzyId") REFERENCES "Quizzy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_whizProjectId_fkey" FOREIGN KEY ("whizProjectId") REFERENCES "WhizProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceCodeEmbedding" ADD CONSTRAINT "SourceCodeEmbedding_whizProjectId_fkey" FOREIGN KEY ("whizProjectId") REFERENCES "WhizProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhizCommit" ADD CONSTRAINT "WhizCommit_whizProjectId_fkey" FOREIGN KEY ("whizProjectId") REFERENCES "WhizProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhizSavedQuestion" ADD CONSTRAINT "WhizSavedQuestion_whizProjectId_fkey" FOREIGN KEY ("whizProjectId") REFERENCES "WhizProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhizSavedQuestion" ADD CONSTRAINT "WhizSavedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
