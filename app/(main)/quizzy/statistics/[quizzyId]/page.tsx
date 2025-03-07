import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import ResultCard from "@/components/quiz/statistics/results-card";
import AccuracyCard from "@/components/quiz/statistics/accuracy-card";
import TimeTakenCard from "@/components/quiz/statistics/time-taken";
import QuestionList from "@/components/quiz/statistics/question-list";

interface StatisticsPageProps {
    params: {
        quizzyId: string; 
    }
}

export default async function StatisticsPage({params}: StatisticsPageProps){
    const { quizzyId } = await params;
    const {userId: clerkId} = await auth();

    if(!clerkId) {
        redirect("/sign-in");
    }
    
    const user = await prisma?.user.findUnique({
        where: {
            userId: clerkId,
        }
    })

    const quizzy = await prisma?.quizzy.findUnique({
        where: {
            id: quizzyId,
            userId: user?.id,
        },
        include: {
            quizzyQuestions: true
        }
    })

    if(!quizzy) {
        redirect("/quizzy");
    }

    let accuracy :number = 0;

    if(quizzy.gameType === "mcq") {
        let totalCorrect = quizzy.quizzyQuestions.reduce((acc, question) => {
            if(question.isCorrect) {
                return acc + 1;
            }
            return acc;
        }, 0 );
        accuracy = (totalCorrect / quizzy.quizzyQuestions.length) * 100;

    } else if (quizzy.gameType === "open_ended") {
        let totalCorrect = quizzy.quizzyQuestions.reduce((acc, question) => {
                return acc + (question.percentageCorrect ?? 0)
        }, 0 );
        accuracy = (totalCorrect / quizzy.quizzyQuestions.length);
    }

    accuracy = Math.round(accuracy*100)/100;

    return (
        <div className="mx-auto max-w-7xl p-8 mt-72">
            <div className="flex items-center justify-between mb-8 gap-x-36">
                <div className="space-y-1">
                    <h2 className="text-2xl lg:text-3xl font-bold whitespace-nowrap">Quiz Statistics</h2>
                    <p className="text-muted-foreground hidden md:block">
                        Detailed analysis of quiz performance
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/quizzy" className={cn(buttonVariants({size: "lg"}), "hover:bg-primary/90 transition-colors")}>
                        <LucideLayoutDashboard className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>


            <div className="grid gap-4 mt-4 md:grid-cols-7">
                <ResultCard accuracy={accuracy}/>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground mt-4 shadow-lg hover:shadow-xl transition-shadow">
                <QuestionList questions={quizzy.quizzyQuestions}  />
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-7">
                <AccuracyCard accuracy={accuracy}/>
                <TimeTakenCard timeEnded={new Date()} timeStarted={quizzy.timeStarted} />
            </div>
                {/* Statistics cards will go here */}
        </div>
    )
}