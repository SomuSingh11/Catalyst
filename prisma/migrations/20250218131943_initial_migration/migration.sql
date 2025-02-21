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
    "idCorrect" BOOLEAN,
    "options" JSONB,
    "percentageCorrect" DOUBLE PRECISION,
    "questionType" "GameType" NOT NULL,
    "userAnswer" TEXT,

    CONSTRAINT "QuizzyQuestion_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "leetcodeQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizzy" ADD CONSTRAINT "Quizzy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzyQuestion" ADD CONSTRAINT "QuizzyQuestion_quizzyId_fkey" FOREIGN KEY ("quizzyId") REFERENCES "Quizzy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
