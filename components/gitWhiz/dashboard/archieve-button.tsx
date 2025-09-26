import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ArchieveButtonProps {
  className?: string;
  projectId?: string;
}

const ArchieveButton = ({ className, projectId }: ArchieveButtonProps) => {
  const archieveProject = api.whizProject.archieveProject.useMutation();
  const utils = api.useUtils();
  const router = useRouter();

  const handleArchive = () => {
    if (!projectId) {
      toast.error("Cannot archive project: Project ID is missing.");
      return;
    }

    const confirm = window.confirm("Archive this project?");
    if (confirm) {
      archieveProject.mutate(
        { projectId },
        {
          onSuccess: () => {
            toast.success("Project archived");
            utils.whizProject.getProjects.invalidate();
            router.push("/gitwhiz");
          },
          onError: (error) => {
            toast.error("Error archiving project:", {
              description: error.message,
            });
          },
        }
      );
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          disabled={archieveProject.isPending || !projectId}
          size="sm"
          variant={"ghost"}
          className={cn(
            "h-8 w-8 p-0 bg-white/80 hover:bg-red-500/10 shadow-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          // Updated onClick handler
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation(); // This stops the click from reaching the parent card
            handleArchive();
          }}
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary ml-2 text-green-800" side="right">
        <p>Archieve Project</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ArchieveButton;
