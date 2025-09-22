"use client";

import CommitLog from "@/components/gitWhiz/dashboard/commit-log";
import QAPage from "../qa/page";
import ProjectInfo from "@/components/gitWhiz/project-info";
import CommitHeader from "@/components/utilities/commit-heading";

function ProjectPage() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <QAPage />
          <ProjectInfo />
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
