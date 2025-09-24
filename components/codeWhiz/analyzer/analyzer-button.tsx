import { Button } from "@/components/ui/button";
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
  );
};

export default AnalyzerButton;
