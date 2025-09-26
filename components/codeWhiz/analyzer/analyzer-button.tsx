import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArchieveButtonProps {
  className?: string;
  projectId?: string;
}

const AnalyzerButton = ({ className, projectId }: ArchieveButtonProps) => {
  const router = useRouter();
  const { setProjectId } = useProject();

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
            router.push(`/gitwhiz/analyzer`);
          }}
        >
          <Sparkles className="h-4 w-4 text-green-900" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-green-800" side="top">
        <p>CodeWhiz Analyzer</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AnalyzerButton;
