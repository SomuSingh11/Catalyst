import { WhizSavedQuestion } from "@prisma/client";
import { MessageCircleQuestion } from "lucide-react";
import React from "react";

interface SavedAnswerHeaderProps {
  question: WhizSavedQuestion;
}

function SavedAnswerHeader({ question }: SavedAnswerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 w-full">
      {/* Question Box */}
      <div className="flex-1 min-w-0">
        <div className="bg-secondary/15 text-green-800 rounded-lg p-3 sm:p-4 border-l-4 border-green-900 flex-shrink-0">
          <div className="flex items-start gap-2 text-left">
            <MessageCircleQuestion className="size-5 text-gray-800 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-700 text-sm sm:text-base line-clamp-2 text-left">
                {question.question}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedAnswerHeader;
