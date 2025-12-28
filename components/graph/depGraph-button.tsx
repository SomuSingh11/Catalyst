import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useProject from "@/hooks/use-project";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Network } from "lucide-react";
import { useRouter } from "next/navigation";

interface DependencyGraphButtonProps {
  className?: string;
  projectId?: string;
}

const DependencyGraphButton = ({
  className,
  projectId,
}: DependencyGraphButtonProps) => {
  const router = useRouter();
  const { setProjectId } = useProject();
  const { setOpen } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          disabled={!projectId}
          size="sm"
          variant={"ghost"}
          className={cn(
            "h-8 w-8 p-0 bg-white/80 hover:bg-secondary/10 shadow-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setProjectId(projectId!);
            setOpen(false);
            router.push(`/gitwhiz/graph`);
          }}
        >
          <Network className="h-4 w-4 text-green-900" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-green-800" side="top">
        <p>Dependency Graph</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DependencyGraphButton;
