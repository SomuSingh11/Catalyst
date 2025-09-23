/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AskQuestionCard from "@/components/gitWhiz/dashboard/ask-question-card";
import SavedAnswerSheet from "@/components/gitWhiz/dashboard/askQuestion/saved-answer-sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
import SavedAnswerSkeleton from "@/components/utilities/saved-answer-skeleton";
import SavedInsights from "@/components/utilities/saved-insights";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { CalendarDays } from "lucide-react";
import React from "react";

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions, isLoading } =
    api.whizProject.getSavedQuestions.useQuery({
      projectId,
    });

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleTriggerClick = (index: number) => {
    setQuestionIndex(index);
    setIsSheetOpen(true); // Manually open the sheet
  };

  return (
    <div>
      <AskQuestionCard />
      <div className="h-12"></div>
      <SavedInsights questions={questions || []} />
      <div className="h-6"></div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <SavedAnswerSkeleton />
              <SavedAnswerSkeleton />
              <SavedAnswerSkeleton />
            </>
          ) : (
            questions?.map((q, index) => (
              <button
                key={q.id}
                onClick={() => handleTriggerClick(index)}
                className="flex items-center gap-4 bg-white hover:bg-gray-50 transition-colors border rounded-lg p-4 shadow-sm text-left w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={q.user.imageUrl ?? "/default-avatar.png"}
                    alt="User Avatar"
                  />
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium line-clamp-1">
                    {q.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <CalendarDays className="size-4" />
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {question && <SavedAnswerSheet question={question} />}
      </Sheet>
    </div>
  );
};

export default QAPage;
