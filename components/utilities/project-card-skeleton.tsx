import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function ProjectCardSkeleton() {
  return (
    <Card className="h-64 flex flex-col">
      <CardContent className="flex-1 p-4">
        <div className="relative space-y-2 p-4 bg-white rounded-lg border border-gray-200 h-40">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="w-4 h-4" />
          </div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="absolute top-2 right-2 w-8 h-8" />
        </div>
      </CardContent>

      <div className="p-6 pt-0 flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-36" />
          <div className="flex gap-2 items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCardSkeleton;
