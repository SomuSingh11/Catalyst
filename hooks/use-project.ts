import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const { data: projects, isLoading } = api.whizProject.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage("whizProject", "");
  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    isLoading,
    project,
    projectId,
    setProjectId,
  };
};

export default useProject;
