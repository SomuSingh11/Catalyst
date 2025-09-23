import { WhizSavedQuestion } from "@/types/gitWhiz";
import { Bookmark } from "lucide-react";
import React from "react";

interface SavedInsightsProps {
  questions: WhizSavedQuestion[];
}

function SavedInsights({ questions }: SavedInsightsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Bookmark className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
            Saved Insights
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review previously answered questions about this codebase.
          </p>
        </div>
      </div>
      {questions && (
        <div className="px-2.5 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-full">
          {questions.length}
        </div>
      )}
    </div>
  );
}

export default SavedInsights;
