/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AskQuestionCard from "@/components/gitWhiz/dashboard/ask-question-card";
import CodeReferences from "@/components/gitWhiz/dashboard/code-references";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import MDEditor from "@uiw/react-md-editor";
import { Brain, CalendarDays, Code2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.whizProject.getSavedQuestions.useQuery({ projectId });

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];

  return (
    <Sheet>
      <AskQuestionCard />

      <div className="h-6"></div>
      <h2 className="text-xl font-semibold text-gray-900">Saved Questions</h2>
      <div className="h-3"></div>

      <div className="flex flex-col gap-3">
        {questions?.map((q, index) => (
          <SheetTrigger key={q.id} onClick={() => setQuestionIndex(index)} asChild>
            <button className="flex items-center gap-4 bg-white hover:bg-gray-50 transition-colors border rounded-lg p-4 shadow-sm text-left w-full">
              <Image
                src={q.user.imageUrl ?? "/default-avatar.png"}
                alt="User Avatar"
                height={36}
                width={36}
                className="rounded-full border"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium line-clamp-1">{q.question}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <CalendarDays className="size-4" />
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          </SheetTrigger>
        ))}
      </div>

      {question && (
  <SheetContent className="sm:max-w-[80vw] flex flex-col h-full p-6 bg-white border-l border-gray-300">
    
    {/* Header */}
    <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-300">
      <SheetTitle className="sr-only">Saved Question Details</SheetTitle> {/* Screen-reader only fallback */}
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-200 rounded-lg shadow">
          <Brain className="size-6 text-black" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-black">{question.question}</h2>
          <p className="text-sm text-gray-600">
            Asked on {new Date(question.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </SheetHeader>

    {/* Content */}
    <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-4 space-y-6">
      
      {/* AI Response */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="size-5 text-black" />
          <h4 className="text-black font-medium">AI Response</h4>
        </div>
        <div className="border rounded-lg p-4">
          <MDEditor.Markdown
            source={question.answer}
            className="w-full prose max-w-none"
          />
        </div>
      </div>

      {/* Referenced Files */}
      {question.filesReferences && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="size-5 text-black" />
            <h4 className="text-black font-medium">Referenced Files</h4>
          </div>
          <CodeReferences fileReferences={(question.filesReferences ?? []) as any} />
        </div>
      )}
    </div>
  </SheetContent>
)}


    </Sheet>
  );
};

export default QAPage;
