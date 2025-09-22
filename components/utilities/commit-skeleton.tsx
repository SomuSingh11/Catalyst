import React from "react";
import { Skeleton } from "../ui/skeleton";

function CommitSkeleton() {
  return (
    <li className="relative flex gap-x-4">
      <div className="absolute left-0 top-0 flex w-6 justify-center h-6">
        <div className="w-px translate-x-1 bg-gray-200"></div>
      </div>

      <Skeleton className="relative mt-4 size-8 flex-none rounded-full" />

      <div className="flex-auto rounded-xl bg-white p-4 ring-1 ring-gray-200/60 shadow-sm">
        <div className="flex justify-between gap-x-4 mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </li>
  );
}

export default CommitSkeleton;
