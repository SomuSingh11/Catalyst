"use client";

import React from "react";
import ArchieveButton from "@/components/gitWhiz/dashboard/archieve-button";
import useProject from "@/hooks/use-project";
import { BookCopy, CalendarDays, ExternalLink, Undo2 } from "lucide-react";
import Link from "next/link";
import AnalyzerButton from "../codeWhiz/analyzer/analyzer-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import DependencyGraphButton from "../graph/depGraph-button";
import { useRouter } from "next/navigation";

function ProjectInfo() {
  const { project } = useProject();
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/gitwhiz");
  };

  return (
    <div>
      <header className="p-2 mb-4 border rounded-lg bg-white/80 shadow-sm">
        <div className="flex items-center text-sm text-gray-600 justify-between w-full">
          <div className="flex justify-between items-center md:w-3/4 mx-auto space-x-4">
            <Tooltip>
              <TooltipTrigger>
                <div className="h-8 w-8 p-0 bg-white/80 hover:bg-secondary/10 shadow-sm flex items-center justify-center rounded-md border border-sidebar">
                  <BookCopy className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="bg-secondary text-green-800"
                side="top"
              >
                <span className="text-thin font-code">
                  Project: {project?.name || "Project Name"}
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={handleHomeClick}
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-secondary/10 shadow-sm flex items-center justify-center rounded-md border border-sidebar"
                >
                  <Undo2 className="h-4 w-4 text-gray-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary text-gray-800" side="top">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <AnalyzerButton projectId={project?.id} />
            <DependencyGraphButton projectId={project?.id} />
            <ArchieveButton projectId={project?.id} />

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
                  Created At:{" "}
                  {project
                    ? new Date(project?.createAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </TooltipContent>
            </Tooltip>
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
