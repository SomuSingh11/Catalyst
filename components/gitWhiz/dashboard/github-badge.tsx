import { ExternalLink, GithubIcon } from "lucide-react";
import { Badge } from '@/components/ui/badge';
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

interface GitHubBadgeProps{
  project: WhizProject | null;
}

const GitHubBadge = ({project}: GitHubBadgeProps) => {
    return <div>
    <Badge className="flex items-center font-medium gap-2 px-4 py-2 rounded-md bg-gray-900 text-white dark:bg-white dark:text-black">
      <GithubIcon className="size-5" />
      <span className='font-normal'> The project is linked to: </span>
      <Link
        href={project?.githubUrl ?? ""}
        target="_blank"
        rel="noopener noreferrer"
        className='font-normal'
      >
       {project?.githubUrl}
      </Link>

      <ExternalLink className="size-4 opacity-80" />
    </Badge>
  </div>
}

export default GitHubBadge;