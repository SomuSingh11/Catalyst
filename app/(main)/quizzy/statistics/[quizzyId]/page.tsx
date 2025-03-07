import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

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
        }
    })

    if(!quizzy) {
        redirect("/quizzy");
    }
    return (
        <div className="mx-auto max-w-7xl p-8">
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
                {/* Statistics cards will go here */}
            </div>
                {/* Statistics cards will go here */}

            <div className="mt-6">
                <pre className="p-4 rounded-lg bg-muted overflow-auto">
                    {JSON.stringify(quizzy, null, 2)}
                </pre>
            </div>
        </div>
    )
}