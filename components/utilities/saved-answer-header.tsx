import { WhizSavedQuestion } from "@prisma/client";
import { CalendarDays, MessageCircleQuestion } from "lucide-react";
import React from "react";
interface SavedAnswerHeaderProps {
  question: WhizSavedQuestion;
}
function SavedAnswerHeader({ question }: SavedAnswerHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="bg-secondary/15 text-green-800 rounded-lg p-4 border-l-4 border-green-900 flex-shrink-0">
          <div className="flex items-start gap-2">
            <MessageCircleQuestion className="size-5 text-gray-800 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">{question.question}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <CalendarDays className="size-4 inline mr-1" />
        <p className="text-sm text-gray-600">
          {new Date(question.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default SavedAnswerHeader;
