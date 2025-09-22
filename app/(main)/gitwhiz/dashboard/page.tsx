"use client";

import ArchieveButton from "@/components/gitWhiz/dashboard/archieve-button";
import AskQuestionCard from "@/components/gitWhiz/dashboard/ask-question-card";
import CommitLog from "@/components/gitWhiz/dashboard/commit-log";
import CreateButton from "@/components/gitWhiz/dashboard/create-button";
import GitHubBadge from "@/components/gitWhiz/dashboard/github-badge";
import useProject from "@/hooks/use-project";
import React from "react";

function DashboardPage() {
  const { project } = useProject();
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4 p-2">
        {/* GitHub Repository Badge */}
        {project?.githubUrl && <GitHubBadge project={project} />}
        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          {/* TeamMembers
          InviteMembers */}
          <CreateButton />
          <ArchieveButton />
        </div>
      </div>

      <div className="mt-4">
        {/* <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'> */}
        <div>
          <AskQuestionCard />
        </div>
      </div>

      <div className="h-8"></div>
      <CommitLog />
    </div>
  );
}

export default DashboardPage;
