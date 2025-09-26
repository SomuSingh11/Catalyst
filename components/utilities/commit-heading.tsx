import { GitCommit } from "lucide-react";
import React from "react";

function CommitHeader() {
  return (
    <div className="w-full pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-8 sm:p-0">
        {/* Icon */}
        <div className="flex-shrink-0 bg-gray-100 text-gray-800 p-3 rounded-xl shadow-sm flex items-center justify-center">
          <GitCommit className="h-6 w-6" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-lg sm:text-2xl font-semibold font-display text-gray-800 tracking-tight truncate">
            Commit History
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-1.5 line-clamp-2">
            An AI-powered summary of recent changes to your codebase, including
            insights and trends.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommitHeader;
