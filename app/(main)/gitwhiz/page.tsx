"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/components/utilities/project-card";
import ProjectCardSkeleton from "@/components/utilities/project-card-skeleton";
import useProject from "@/hooks/use-project";
import { Project } from "@/types/gitWhiz";
import { useState } from "react";
import { Bird } from "lucide-react";
import CreateProject from "@/components/gitWhiz/create-project";
import { useRouter } from "next/navigation";

export default function Page() {
  const { projects, isLoading, setProjectId } = useProject();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const router = useRouter();

  const handleCreateProject = () => {
    setIsCreateModelOpen(true);
  };

  const handleProjectClick = (project: Project) => {
    setProjectId(project.id);
    router.push(`/gitwhiz/project`);
  };

  return (
    <div className="p-4 sm:p-6">
      <Dialog open={isCreateModelOpen} onOpenChange={setIsCreateModelOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              <div>
                <Bird className="inline mr-2 mb-1" />
                <span className="text-lg font-medium">
                  Create GitWhiz Project
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              <p className="text-sm text-muted-foreground mt-1">
                Start by linking a GitHub repo. GitWhiz will use this to
                generate insights and dashboards.
              </p>
            </DialogDescription>
          </DialogHeader>
          <CreateProject />
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-gray-600 truncate">
          Projects
        </h1>

        {isLoading ? (
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
        ) : (
          <span className="bg-secondary/60 rounded-sm p-1 flex-shrink-0">
            <span className="text-green-600 px-1 py-0.5 text-xs sm:text-sm">
              {projects?.length}
            </span>
          </span>
        )}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Create new project card */}
        <div onClick={handleCreateProject}>
          <ProjectCard isCreateCard={true} isLoading={isLoading} />
        </div>

        {isLoading && (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        )}

        {/* Project cards */}
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
