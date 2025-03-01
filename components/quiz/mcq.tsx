"use client";

import React from "react";
import { Quizzy, QuizzyQuestion } from "@prisma/client";
import { ChevronRight, Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface MCQProps {
  quiz: Quizzy & {
    quizzyQuestions: Pick<QuizzyQuestion, "id" | "options" | "question">[];
  };
}

export default function MCQ({ quiz }: MCQProps) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number>(-1);

  const currentQuestion = React.useMemo(() => {
    return quiz.quizzyQuestions[questionIndex];   
  }, [questionIndex, quiz.quizzyQuestions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if(!currentQuestion.options) return [];

    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

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
        
        <Button className="mt-2 ml-auto">
          <span className="p-1">Next</span>
          <ChevronRight className="w-6 h-6"/>
        </Button>
        
      </div>
    </div>
  );
}
