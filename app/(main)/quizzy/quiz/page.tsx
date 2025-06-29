import React from "react";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/quiz/quiz-creation";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Quizzy | Quiz",
};

export default async function QuizPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma?.user.findUnique({
    where: {
      userId: clerkId
    }
  })
  if (!user) {
    redirect("/");
  } return (
    <div className="flex gap-x-20 items-center justify-center">
        <QuizCreation />  
    </div>
  );
}