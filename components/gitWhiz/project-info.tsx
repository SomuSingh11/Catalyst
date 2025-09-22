"use client";

import React from "react";
import ArchieveButton from "@/components/gitWhiz/dashboard/archieve-button";
import useProject from "@/hooks/use-project";
import { BookCopy, CalendarDays, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

function ProjectInfo() {
  const { project, isLoading } = useProject();

  return (
    <div>
      <header className="p-2 mb-4 border rounded-lg bg-white/80 shadow-sm">
        <div className="flex items-center text-sm text-gray-600 justify-between">
          {/* Name */}
          <div className="flex items-center gap-2 font-medium">
            <BookCopy className="size-5 text-green-800" />
            {isLoading ? (
              <Skeleton className="pl-3 h-4 w-36" />
            ) : (
              <span>{project?.name || "Project Name"}</span>
            )}
          </div>

          <div className="flex justify-between items-center gap-4 ">
            {/* Created At */}
            <div className="flex items-center gap-2 p-1.5 ">
              <CalendarDays className="size-5 text-gray-400" />
              {isLoading ? (
                <Skeleton className="pl-3 h-4 w-20" />
              ) : (
                <span className="text-thin font-code">
                  {project
                    ? new Date(project?.createAt).toLocaleDateString()
                    : "N/A"}
                </span>
              )}
            </div>

            <ArchieveButton projectId={project?.id} />

            <Link
              href={project?.githubUrl ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:bg-secondary/40 bg-white p-1.5 rounded-md border border-sidebar"
            >
              <ExternalLink className="size-5 text-green-800" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ProjectInfo;
