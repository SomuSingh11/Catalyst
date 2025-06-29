import HistoryComponent from "@/components/quiz/history";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function HistoryPage(){
    const {userId: clerkId} = await auth();
    if(!clerkId){
        redirect("/sign-in");
    }

    const user = await prisma?.user.findUnique({
        where: {
            userId: clerkId
        }
    })
    if (!user) {
        redirect("/");
    }

    return <div className="flex items-center justify-center">
        <Card className="shadow-lg max-h-screen">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <CardTitle className="text-2xl font-bold">History</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors mr-auto" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click on any quiz to view detailed statistics</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider></div>
                    
                    <Link 
                        href={`/quizzy`}
                        className={buttonVariants()}
                    >
                        <LucideLayoutDashboard className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="overflow-y-auto scrollbar-hide">
                <ScrollArea className="h-[70vh] w-[60vw] p-4 rounded-md border">
                <HistoryComponent limit={100} userId={user.id} />
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
}