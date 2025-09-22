import { ExternalLink, GithubIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface WhizProject {
  id: string;
  name: string;
  githubUrl: string;
  githubToken?: string | null;
  createAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

interface GitHubBadgeProps {
  project: WhizProject | null;
}

const GitHubBadge = ({ project }: GitHubBadgeProps) => {
  return (
    <div>
      <Badge className="flex items-center font-medium rounded-md bg-gray-900 text-white dark:bg-white dark:text-black">
        <GithubIcon className="size-5" />
        <Link
          href={project?.githubUrl ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="font-normal"
        ></Link>
      </Badge>
      <ExternalLink className="size-4 opacity-80" />
    </div>
  );
};

export default GitHubBadge;
