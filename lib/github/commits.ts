/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Octokit } from "octokit";
import { aiSummariseCommit } from "@/lib/services/gemini";
import prisma from "@/lib/db";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

// Fetches the latest commits from a specific GitHub repository
export const getCommitHashes = async (
  githubUrl: string
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid github url");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
  ) as any[]; // Sorts commits by date (newest first)

  // Returns the 15 most recent commits with details.
  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

// Retrieves a project's GitHub URL from your database using Prisma
async function fetchProjectGithubUrl(projectId: string) {
  const project = await prisma?.whizProject.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Project has no github url");
  }

  return { project, githubUrl: project?.githubUrl };
}

// Compares fetched commits against commits already stored in your database
// Returns only the commits that haven't been processed yet
// Prevents duplicate processing of the same commits
async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[]
) {
  const processedCommits = await prisma?.whizCommit.findMany({
    where: {
      whizProjectId: projectId,
    },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits?.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash
      )
  );
  return unprocessedCommits;
}

export const pollCommits = async (projectId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash);
    })
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await prisma?.whizCommit.createMany({
    data: summaries.map((summary, index) => {
      return {
        whizProjectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });
  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  // get the diff and pass into the AI Model
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: `application/vnd.github.v3.diff`,
    },
  });

  return (await aiSummariseCommit(data)) || "";
}
