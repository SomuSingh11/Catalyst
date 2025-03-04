import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import OpenEnded from "@/components/quiz/open-ended";

interface OpenEndedPageProps {
  params: {
    quizzyId: string;
  };
}

export default async function OpenEndedPage({ params }: OpenEndedPageProps) {
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
          answer: true,
        },
      },
    },
  });

  if (!quiz || quiz.gameType !== "open_ended") {
    return redirect("/quizzy");
  }
  return (
    <div>
      <OpenEnded quiz={quiz} />
      {/* <pre>{JSON.stringify(quiz, null, 2)}</pre> */}
    </div>
  );
}