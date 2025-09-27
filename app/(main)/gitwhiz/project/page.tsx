"use client";

import CommitLog from "@/components/gitWhiz/dashboard/commit-log";
import QAPage from "@/components/gitWhiz/saved-insights";
import ProjectInfo from "@/components/gitWhiz/project-info";
import CommitHeader from "@/components/utilities/commit-heading";
import ProjectIndexingPage from "@/components/gitWhiz/dashboard/project-indexing";

function ProjectPage() {
  return (
    <div className="h-full w-full p-2 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {/* Left column - Project Info and QA */}
        <div className="lg:col-span-1">
          <div className="space-y-4 sm:space-y-6">
            <ProjectInfo />
            <QAPage />
          </div>
        </div>

        {/* Right column - Commits */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <CommitHeader />
            <CommitLog />
          </div>
        </div>
      </div>

      {/* Project Indexing - Full width at bottom */}
      <div className="mt-6 sm:mt-8 lg:mt-12">
        <ProjectIndexingPage />
      </div>
    </div>
  );
}

export default ProjectPage;
