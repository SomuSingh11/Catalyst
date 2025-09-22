"use client";

import React from "react";
import ArchieveButton from "@/components/gitWhiz/dashboard/archieve-button";
import GitHubBadge from "@/components/gitWhiz/dashboard/github-badge";
import useProject from "@/hooks/use-project";
import { CalendarDays, User, Users } from "lucide-react";

function ProjectInfo() {
  const { project } = useProject();

  return (
    <div>
      <header className="mb-8 p-4 border rounded-lg bg-gray-50/50">
        {/* Top Row for Title and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-y-4 mb-4 pb-4 border-b">
          {project?.githubUrl && <GitHubBadge project={project} />}
          <div className="flex items-center gap-2">
            <ArchieveButton projectId={project?.id} />
          </div>
        </div>
        {/* Metadata Row */}
        <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          {/* Author */}
          <div className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4 text-gray-400" />
            <span>{project?.author || "Author Name"}</span>
          </div>
          {/* Collaborators */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <strong className="font-medium">Collaborators:</strong>
            {/* Placeholder for collaborators */}
            <div className="flex -space-x-2 overflow-hidden"></div>
          </div>
          {/* Created At */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <strong className="font-medium">Created:</strong>
            <span>
              {project
                ? new Date(project?.createAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ProjectInfo;
