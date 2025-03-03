"use client";

import React from "react";
import { Quizzy, QuizzyQuestion } from "@prisma/client";
import { BarChart, Check, ChevronRight, Loader2, Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quiz";

import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MCQProps {
  quiz: Quizzy & {
    quizzyQuestions: Pick<QuizzyQuestion, "id" | "options" | "question">[];
  };
}

export default function MCQ({ quiz }: MCQProps) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number>(-1);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  
  const {mutate: checkAnswer, isPending: isChecking} = useMutation({
    mutationFn: async () => {
      const payload : z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedOption]
      };
      const response = await axios.post("/api/quizzy/checkAnswer", payload);
      return response.data;
    }
  })

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({isCorrect}) => {
        // toast("Answer checked", {
        //   description: <Check />
        // })
          if(isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
          } else {
            setWrongAnswers((prev) => prev + 1);
          }
          
          if(questionIndex === quiz.quizzyQuestions.length - 1) setHasEnded(true);
          setQuestionIndex((prev) => prev + 1);
          setSelectedOption(-1);
      }
    })
  }, [checkAnswer, questionIndex, quiz.quizzyQuestions.length]);

  React.useEffect(() => {
    const handleKeyEvent = (e: KeyboardEvent) => {
      if(e.key === "1") {
        setSelectedOption(0);
      } else if(e.key === "2") {
        setSelectedOption(1);
      } else if(e.key === "3") {
        setSelectedOption(2);
      } else if(e.key === "4") {
        setSelectedOption(3);
      } else if(e.key === "Enter") {
        handleNext();
      }
    }

      document.addEventListener("keydown", handleKeyEvent);
      return ()=>{document.removeEventListener("keydown", handleKeyEvent)}
  }, [handleNext]);

  const currentQuestion = React.useMemo(() => {
    return quiz.quizzyQuestions[questionIndex];   
  }, [questionIndex, quiz.quizzyQuestions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if(!currentQuestion.options) return [];

    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  if(hasEnded) {
    return (
      <div className="flex flex-col items-center justify-center md:w-[80vw] max-w-2xl w-[90vw] gap-4">
        <div className="w-full p-8 rounded-lg bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Quiz Completed!</h2>
          <div className="text-xl text-foreground">
            Time taken: <span className="font-semibold">{"3m 4s"}</span>
          </div>
          <div className="flex gap-8 items-center justify-center w-full">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{wrongAnswers}</p>
              <p className="text-sm text-muted-foreground">Wrong</p>
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
          <Timer className="mr-2" />
          <span>00:00</span>
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
        {options.map((option, index) => {
          return (
            <Button 
              key={index} 
              className="justify-start w-full py-8 mb-4"
              variant={selectedOption === index ? "default" : "secondary"}
              onClick={() => {
                setSelectedOption(index)
              }}
              >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">{index+1}</div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })} 
        
        <Button 
          className="mt-2 ml-auto"
          onClick={handleNext}
          disabled={selectedOption == -1 || isChecking}
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
  );
}
