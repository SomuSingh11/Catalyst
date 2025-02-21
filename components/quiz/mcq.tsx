"use client";

import React from "react";
import { Quizzy, QuizzyQuestion } from "@prisma/client";
import { Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface MCQProps {
  quiz: Quizzy & {
    quizzyQuestions: Pick<QuizzyQuestion, "id" | "options" | "question">[];
  };
}

export default function MCQ({ quiz }: MCQProps) {
  const [questionIndex, setQuestionIndex] = React.useState(0);

  const currentQuestion = React.useMemo(() => {
    return quiz.quizzyQuestions[questionIndex];
  }, [questionIndex, quiz.quizzyQuestions]);

  const options = React.useMemo(() => {
    return JSON.parse(currentQuestion.options as String) as string[];
  }, [currentQuestion]);

  return (
    <div className="flex flex-col md:w-[80vw] max-w-2xl w-[90vw]">
      <div className="flex flex-row justify-between ">
        {/* Topic Name */}
        <p>
          <span className="text-slate-400">Topic</span>
          <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
            {quiz.topic}
          </span>
        </p>

        <div className="flex self-start mt-3 text-slate-400">
          <Timer className="mr-2" />
          <span>00:00</span>
        </div>
        {/* Counter here */}
      </div>

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>1</div>
            <div className="text-base text-slate-400">
              {quiz.quizzyQuestions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            What is the main principal?
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
