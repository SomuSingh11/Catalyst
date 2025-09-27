import React from "react";
import { Skeleton } from "../ui/skeleton";

function SavedAnswerSkeleton() {
  return (
    <div className="flex items-center gap-4 border rounded-lg p-6 shadow-sm w-full bg-white">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default SavedAnswerSkeleton;
