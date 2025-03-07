import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QuizzyQuestion } from '@prisma/client'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionListProps {
    questions: QuizzyQuestion[]
}

const QuestionList = ({questions}: QuestionListProps) => {
    let quizType = questions[0].questionType

    const PreviewTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[10px]'>No.</TableHead>
                    <TableHead>Question & Correct Answer</TableHead>
                    <TableHead>Your Answer</TableHead>
                    {quizType === "open_ended" && (
                        <TableHead className='w-[10px] text-right'>Accuracy</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {questions.slice(0, 2).map((question, index) => (
                    <TableRow key={index}>
                        <TableCell className='font-medium'>{index + 1}</TableCell>
                        <TableCell>
                            {question.question}
                            <br />
                            <br />
                            <span className='font-semibold'>{question.answer}</span>
                        </TableCell>
                        {quizType === "mcq" && (
                            <TableCell className={cn({
                                "text-green-600": question.isCorrect,
                                "text-red-600": !question.isCorrect
                            })}>{question.userAnswer}</TableCell>
                        )}

                        {quizType === "open_ended" && (
                            <TableCell>{question.userAnswer}%</TableCell>
                        )}
                        {quizType === "open_ended" && (
                            <TableCell className='text-right'>{question.percentageCorrect}%</TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer">
                    <PreviewTable />
                    <Button variant="ghost" className="w-full mt-2">
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View All Questions
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
                        All Questions
                    </DialogTitle>
                </DialogHeader>
                <Table>
                    <TableCaption>End of list.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[10px]'>No.</TableHead>
                            <TableHead>Question & Correct Answer</TableHead>
                            <TableHead>Your Answer</TableHead>
                            {quizType === "open_ended" && (
                                <TableHead className='w-[10px] text-right'>Accuracy</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.map((question, index) => (
                            <TableRow key={index}>
                            <TableCell className='font-medium'>{index + 1}</TableCell>
                            <TableCell>
                                {question.question}
                                <br />
                                <br />
                                <span className='font-semibold'>{question.answer}</span>
                            </TableCell>
                            {quizType === "mcq" && (
                                <TableCell className={cn({
                                    "text-green-600": question.isCorrect,
                                    "text-red-600": !question.isCorrect
                                })}>{question.userAnswer}</TableCell>
                            )}
    
                            {quizType === "open_ended" && (
                                <TableCell>{question.userAnswer}%</TableCell>
                            )}
                            {quizType === "open_ended" && (
                                <TableCell className='text-right'>{question.percentageCorrect}%</TableCell>
                            )}
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionList