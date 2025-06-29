"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, GitCommit } from "lucide-react";
import Link from "next/link";

const CommitLog = () => {
    const {project, projectId} = useProject();
    const {data: commits} = api.whizProject.getCommits.useQuery({ projectId });

       // No commits state
    if (!commits || commits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center ">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <GitCommit className="size-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No commits yet</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                    Start making commits to see your project history here.
                </p>
            </div>
        );
    }

    return (
        <>
            <ul className="space-y-6">
                {commits?.map((commit, commitIdx) => {
                    return <li key={commit.id} className="relative flex gap-x-4">
                        <div className={cn(
                            commitIdx === commits.length-1 ? 'h-6' : '-bottom-6',
                            'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className="w-px translate-x-1 bg-gray-200"></div>
                        </div>

                        <>
                        <img src={commit.commitAuthorAvatar} alt='commit avatar' className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"/>
                        
                        <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                            <div className="flex justify-between gap-x-4">
                                <Link 
                                    target="_blank"
                                    href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                                    className="py-0.5 text-xs leading-5 text-gray-500"
                                >
                                    <span className="font-medium text-gray-900">
                                        {commit.commitAuthorName}
                                    </span>{" "}
                                    <span className="inline-flex items-center">
                                        commited
                                        <ExternalLink className="ml-1 size-4"/>
                                    </span>
                                </Link>
                            </div>
                            <span className="font-semibold">
                                    {commit.commitMessage}
                                </span>
                                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                                    {commit.summary}
                                </pre>
                        </div>
                        
                        </>
                    </li>
                })}
            </ul>
        </>
    )
}

export default CommitLog;