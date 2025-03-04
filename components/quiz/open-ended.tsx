"use client";

import React from "react";
  import { Quizzy, QuizzyQuestion } from "@prisma/client";
import { BarChart, Check, ChevronRight, Loader2, Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { differenceInSeconds } from "date-fns";

import { toast } from "sonner";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { z } from "zod";
import axios from "axios";
import BlankAnswerInput from "./components/blank-answer-input";

interface OpenEndedProps {
    quiz: Quizzy & {
        quizzyQuestions: Pick<QuizzyQuestion, "id" | "answer" | "question">[];
    }
}

export default function OpenEnded({quiz} : OpenEndedProps){
    const [totalPercentage, setTotalPercentage] = React.useState<number>(0);
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [hasEnded, setHasEnded] = React.useState<boolean>(false);
    const [now, setNow] = React.useState(new Date());
    const [blankAnswer, setBlankAnswer] = React.useState<string>("");

    React.useEffect(()=>{
        const interval = setInterval(() => {
          if(!hasEnded) setNow(new Date());
        }, 1000)
    
        return ()=>{
          clearInterval(interval)
        }
    }, [hasEnded])

    const {mutate: checkAnswer, isPending: isChecking} = useMutation({
        mutationFn: async () => {
          let filledAnswer = blankAnswer;
          console.log(filledAnswer);
          document.querySelectorAll("#user-blank-input").forEach((input) => {
            filledAnswer = filledAnswer.replace("_____", (input as HTMLInputElement).value);
            (input as HTMLInputElement).value = "";
          })
          const payload : z.infer<typeof checkAnswerSchema> = {
            questionId: currentQuestion.id,
            userAnswer: filledAnswer
          };
          const response = await axios.post("/api/quizzy/checkAnswer", payload);
          return response.data;
        }
    })

    const handleNext = React.useCallback(() => {
        checkAnswer(undefined, {
          onSuccess: ({percentageCorrect}) => {
            toast("Answer checked", {
              description: percentageCorrect === 100 
                ? "Perfect! Your answer matches exactly!" 
                : `Your answer is ${percentageCorrect}% similar to the correct answer`,
            });
              if(questionIndex === quiz.quizzyQuestions.length - 1) {
                setHasEnded(true);
                // Calculate final percentage including the last question
                const finalPercentage = (totalPercentage + percentageCorrect) / quiz.quizzyQuestions.length;
                setTotalPercentage(finalPercentage);
              } else {
                // Add to running total only if not the last question
                setTotalPercentage(prev => prev + percentageCorrect);
                setQuestionIndex(prev => prev + 1);
              }
            }
        })
    }, [checkAnswer, questionIndex, quiz.quizzyQuestions.length, blankAnswer, totalPercentage]);

    React.useEffect(() => {
        const handleKeyEvent = (e: KeyboardEvent) => {
          if(e.key === "Enter") {
            handleNext();
          }
        }
          document.addEventListener("keydown", handleKeyEvent);
          return ()=>{document.removeEventListener("keydown", handleKeyEvent)}
      }, [handleNext]);

    const currentQuestion = React.useMemo(() => {
        return quiz.quizzyQuestions[questionIndex];   
    }, [questionIndex, quiz.quizzyQuestions]);

    if(hasEnded) {
      return (
        <div className="flex flex-col items-center justify-center md:w-[80vw] max-w-2xl w-[90vw] gap-4">
          <div className="w-full p-8 rounded-lg bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Quiz Completed!</h2>
            <div className="text-xl text-foreground">
              Time taken: <span className="font-semibold">{formatTimeDelta(differenceInSeconds(now , quiz.timeStarted))}</span>
            </div>
            <div className="flex gap-8 items-center justify-center w-full">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(totalPercentage)}%</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/quizzy"
                className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
              >
                Back to Quizzes
              </Link>
              <Link
                href={`/quizzy/statistics/${quiz.id}`}
                className={cn(buttonVariants(), "mt-2")}
              >
                View Statistics
                <BarChart className="ml-2 h-4 w-4" />
              </Link>
            </div>  
          </div>
        </div>
      )
    }

    return (
    <div className="flex flex-col md:w-[80vw] max-w-2xl w-[90vw]">
      <div className="flex flex-row justify-between mt-3 p-3">
        {/* Topic Name */}
        <div>
          <span className="text-slate-400 pr-2">Topic</span>
          <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
            {quiz.topic}
          </span>
        </div>

        <div className="flex self-start text-slate-400">
          <Timer className="mr-2 -mt-0.5" />
          <span>{formatTimeDelta(differenceInSeconds(now , quiz.timeStarted))}</span>
        </div>

        {/* Counter here */}
        
      </div>

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex+1}</div>
            <div className="text-base text-slate-400">
              {quiz.quizzyQuestions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput
           answer={currentQuestion.answer}
           setBlankAnswer={setBlankAnswer}   
        />
        
        <Button 
          className="mt-2 ml-auto"
          onClick={handleNext}
          disabled={isChecking}
          >
            {isChecking ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin"/>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Next</span>
                <ChevronRight className="h-4 w-4"/>
              </div>
            )}
        </Button>
        
      </div>
    </div>
    )
}