import { Button } from "@/components/ui/button"
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const ArchieveButton = () => {
    const archieveProject = api.whizProject.archieveProject.useMutation();
    const { projectId } = useProject()
    const utils = api.useUtils();

    return (
        <Button 
            disabled={archieveProject.isPending}
            size='sm'
            variant={"destructive"}
            onClick={() => {
                const confirm = window.confirm("Archieve this project?");
                if(confirm) archieveProject.mutate({projectId}, {
                    onSuccess: () => {
                        toast.success("Project archieved");
                        utils.whizProject.getProjects.invalidate();
                    },
                    onError: () => {
                        toast.error("Error archieving project");
                    }
                })
            }}
        >
            Archieve
        </Button>
    )
}

export default ArchieveButton;