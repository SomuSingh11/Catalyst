import { WhizSavedQuestion } from "@/types/gitWhiz";
import { Bookmark } from "lucide-react";
import React from "react";

interface SavedInsightsProps {
  questions: WhizSavedQuestion[];
}

function SavedInsights({ questions }: SavedInsightsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-gray-100 p-3 rounded-lg relative">
          {questions && (
            <div className="px-2 py-0.5 text-sm font-medium text-green-600 bg-secondary/20 rounded-full flex-shrink-0 absolute -top-3 -right-2">
              <span className="text-xs">{questions.length}</span>
            </div>
          )}
          <Bookmark className="h-6 w-6 text-gray-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight truncate">
            Saved Insights
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            Review previously answered questions about this codebase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SavedInsights;
