import { FileText, GitBranch, Github } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Project } from "@/types/gitWhiz";
import { Skeleton } from "../ui/skeleton";
import ArchieveButton from "../gitWhiz/dashboard/archieve-button";
import AnalyzerButton from "../codeWhiz/analyzer/analyzer-button";

interface ProjectCardProps {
  isCreateCard?: boolean;
  project?: Project;
  onClick?: (project: Project) => void;
  isLoading?: boolean;
}

export default function ProjectCard({
  isCreateCard = false,
  project,
  onClick,
  isLoading,
}: ProjectCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  if (isCreateCard) {
    return (
      <Card className="h-64 border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-secondary/10 transition-colors cursor-pointer group">
        {isLoading ? (
          <CardContent className="flex flex-col items-baseline justify-end h-full p-4">
            <Skeleton className="w-12 h-12 mb-2" />
            <Skeleton className="w-32 h-8" />
          </CardContent>
        ) : (
          <CardContent className="flex flex-col items-baseline justify-end h-full text-gray-500 group-hover:text-green-800/60">
            <div className="w-12 h-12 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold font-display pl-2.5">
              Create project
            </span>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card
      className="h-64 hover:bg-gray-100/40 transition-all cursor-pointer flex flex-col group"
      onClick={onClick ? () => onClick(project as Project) : undefined}
    >
      {/* Content section - takes most space */}
      <CardContent className="flex-1 p-4">
        <div className="relative space-y-2 p-4 bg-white hover:bg-white rounded-lg border border-gray-200 h-40">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-gray-900">
              {project?.name}
            </h3>
            <Github className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 truncate">
            {project?.githubUrl}
          </p>

          {/* Hover button - appears only on card hover */}
          <ArchieveButton
            className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity group-hover:bg-red-500/10"
            projectId={project?.id}
          />
          <AnalyzerButton
            className="absolute top-0 right-14 opacity-0 group-hover:opacity-100 transition-opacity group-hover:bg-secondary/20"
            projectId={project?.id}
          />
        </div>
      </CardContent>

      {/* Footer section with name, date and menu */}
      <div className="p-6 pt-0 0/50 font-display flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-normal font-display text-gray-600">
            {project?.name}
          </p>
          <span className="text-xs text-gray-500 flex gap-2 pt-1">
            {formatDate(project?.updatedAt)}
            <GitBranch className="w-4 h-4 text-gray-400" />
          </span>
        </div>
      </div>
    </Card>
  );
}
