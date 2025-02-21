import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MCQ from "@/components/quiz/mcq";
import prisma from "@/lib/db";

interface MCQPageProps {
  params: {
    quizzyId: string;
  };
}

export default async function MCQPage({ params }: MCQPageProps) {
  const { quizzyId } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const quiz = await prisma.quizzy.findUnique({
    where: {
      id: quizzyId,
    },
    include: {
      quizzyQuestions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!quiz || quiz.gameType !== "mcq") {
    return redirect("/quizzy");
  }
  return (
    <div>
      <MCQ quiz={quiz} />
      {/* <pre>{JSON.stringify(quiz, null, 2)}</pre> */}
    </div>
  );
}
