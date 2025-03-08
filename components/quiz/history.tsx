import { Clock, CopyCheck, Edit2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import prisma from '@/lib/db'

type Props = {
    limit: number,
    userId: string
}

const HistoryComponent = async ({limit, userId}: Props) => {
    const quizzy = await prisma?.quizzy.findMany({
        where:{ userId },
        take: limit,
        orderBy: { timeStarted: "desc" }
    })
  return (
    <div className='space-y-4'>
        {quizzy?.map((quiz) => {
            return (
                <div key={quiz.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center w-full">
                        <div className={cn(
                            "p-2 rounded-full",
                            quiz.gameType === "mcq" 
                                ? "bg-gray-100 text-gray-900" 
                                : "bg-gray-900 text-gray-100"
                        )}>
                            {quiz.gameType === "mcq" ? (
                                <CopyCheck className='w-5 h-5'/>
                            ) : (
                                <Edit2 className='w-5 h-5'/>
                            )}
                        </div>
                        <div className='ml-4 space-y-1 flex-1'>
                            <Link 
                                href={`/quizzy/statistics/${quiz.id}`}
                                className='text-lg font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                            >
                                {quiz.topic}
                            </Link>
                            <div className='flex items-center justify-between'>
                                <p className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                                    <Clock className='w-4 h-4 mr-1 stroke-[1.5]'/>
                                    {new Date(quiz.timeStarted).toLocaleDateString()}
                                </p>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium",
                                    quiz.gameType === "mcq" 
                                        ? "bg-gray-100 text-gray-900" 
                                        : "bg-gray-900 text-gray-100"
                                )}>
                                    {quiz.gameType === "mcq" ? "Multiple Choice" : "Open Ended"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default HistoryComponent