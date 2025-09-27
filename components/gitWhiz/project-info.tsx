"use client";

import React from "react";
import ArchieveButton from "@/components/gitWhiz/dashboard/archieve-button";
import useProject from "@/hooks/use-project";
import { BookCopy, CalendarDays, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import AnalyzerButton from "../codeWhiz/analyzer/analyzer-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function ProjectInfo() {
  const { project, isLoading } = useProject();

  return (
    <div>
      <header className="p-2 mb-4 border rounded-lg bg-white/80 shadow-sm">
        <div className="flex items-center text-sm text-gray-600 justify-between">
          {/* Name */}
          <div className="flex items-center gap-2 font-medium">
            <BookCopy className="size-5 ml-2" />
            {isLoading ? (
              <Skeleton className="pl-3 h-4 w-36" />
            ) : (
              <span className="font-display text-lg">
                {project?.name || "Project Name"}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center gap-4 ">
            <Tooltip>
              <TooltipTrigger>
                <div className="h-8 w-8 p-0 bg-white/80 hover:bg-secondary/10 shadow-sm flex items-center justify-center rounded-md border border-sidebar">
                  <CalendarDays className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="bg-secondary text-green-800"
                side="top"
              >
                <span className="text-thin font-code">
                  {project
                    ? new Date(project?.createAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </TooltipContent>
            </Tooltip>

            <ArchieveButton projectId={project?.id} />
            <AnalyzerButton projectId={project?.id} />

            <Link
              href={project?.githubUrl ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:bg-gray-200/20 bg-white p-1.5 rounded-md border border-sidebar"
            >
              <ExternalLink className="size-5 text-gray-500/80" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ProjectInfo;
