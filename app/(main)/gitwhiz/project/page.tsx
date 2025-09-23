"use client";

import CommitLog from "@/components/gitWhiz/dashboard/commit-log";
import QAPage from "../qa/page";
import ProjectInfo from "@/components/gitWhiz/project-info";
import CommitHeader from "@/components/utilities/commit-heading";

function ProjectPage() {
  return (
    <div className="h-full w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <ProjectInfo />
          <QAPage />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <CommitHeader />
          <CommitLog />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
