import { Dashboard } from "@/components/quiz/dashboard";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function QuizPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma?.user.findUnique({
    where: {
      userId: clerkId
    }
  });

  if (!user) {
    redirect("/");
  }

  const quizData = await prisma?.quizzy.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      timeStarted: "desc"
    },
    take: 10
  });
  
  return (
    <div className="">
      <Dashboard quizData={quizData} userId={user.id} />
    </div>
  );
}
