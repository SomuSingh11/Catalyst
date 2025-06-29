import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreateButton = () => {
    const router = useRouter();

    return (
        <Button 
            variant="default"
            onClick={() => {
            router.push(`/gitwhiz/create`);
        }}>
            Create a new project
        </Button>
    )
}

export default CreateButton;