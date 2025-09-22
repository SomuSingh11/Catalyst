import { GitCommit } from "lucide-react";
import React from "react";

function CommitHeader() {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <GitCommit className="h-5 w-5 text-gray-600" />
        </div>
        <div className="pl-2">
          <p className="text-2xl font-semibold font-display text-gray-600 tracking-tight">
            Commit History
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            An AI-powered summary of recent changes to the codebase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommitHeader;
