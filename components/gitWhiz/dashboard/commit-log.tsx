"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommitSkeleton from "@/components/utilities/commit-skeleton";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, GitCommit, User } from "lucide-react";
import Link from "next/link";

const CommitLog = () => {
  const { project, projectId } = useProject();
  const { data: commits, isLoading } = api.whizProject.getCommits.useQuery({
    projectId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ul className="space-y-6">
          {Array.from({ length: 4 }, (_, index) => (
            <CommitSkeleton key={`skeleton-${index}`} />
          ))}
        </ul>
      </div>
    );
  }

  if (!commits || commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center ">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <GitCommit className="size-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No commits yet
        </h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Start making commits to see your project history here.
        </p>
        <div className="mt-6 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <code className="text-sm text-gray-700">
            git commit -m &quot;Initial commit&quot;
          </code>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIdx) => {
          return (
            <li key={commit.id} className="relative flex gap-x-3 sm:gap-x-4">
              <div
                className={cn(
                  commitIdx === commits.length - 1 ? "h-6" : "-bottom-6",
                  "absolute left-0 top-0 flex w-6 justify-center"
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200"></div>
              </div>

              <>
                <Avatar className="relative size-8 flex-none ring-2 ring-white shadow-sm">
                  <AvatarImage
                    src={commit.commitAuthorAvatar}
                    alt={commit.commitAuthorName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-semibold">
                    {commit.commitAuthorName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Responsive padding on the main card */}
                <div className="flex-auto rounded-xl bg-white p-3 pt-2 sm:p-4 sm:pt-2 ring-1 ring-inset ring-gray-200 shadow-sm hover:shadow-md transition-shadow max-w-full overflow-x-auto">
                  {/* RESPONSIVE HEADER: Stacks vertically on mobile */}
                  <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="pb-1 text-gray-400">
                      <User className="inline size-3.5 mr-1.5 mb-0.5" />
                      <span className="text-xs">{commit.commitAuthorName}</span>
                    </div>
                    <Link
                      target="_blank"
                      href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                      className="py-0.5 text-xs leading-5 text-gray-500"
                    >
                      <span className="inline-flex items-center">
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700 flex break-all">
                          {commit.commitHash?.slice(0, 7)}
                        </code>
                        <ExternalLink className="ml-1 size-4" />
                      </span>
                    </Link>
                  </div>

                  {/* Responsive font size for the commit message */}
                  <p className="text-lg sm:text-xl font-semibold text-green-900 font-display leading-tight break-words">
                    {commit.commitMessage}
                  </p>

                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-500 font-sans break-words">
                      {commit.summary}
                    </pre>
                  </div>
                </div>
              </>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CommitLog;
