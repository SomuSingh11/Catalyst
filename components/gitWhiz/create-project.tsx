"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react"; // tRPC API client
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useProject from "@/hooks/use-project";
import { Loader2 } from "lucide-react";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreateProject = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.whizProject.createProject.useMutation(); // Create mutation hook using tRPC to send createProject mutation
  const utils = api.useUtils();
  const router = useRouter();
  const { setProjectId } = useProject();

  function onSubmit(data: FormInput) {
    console.log(data);
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: (createdProject) => {
          toast.success("Project created successfully");
          utils.whizProject.getProjects.invalidate();
          reset();
          setProjectId(createdProject.project.id);
          router.push("/gitwhiz/project?index=true");
        },
        onError: () => {
          toast.error("Error while creating project");
        },
      }
    );
    return true;
  }

  return (
    <div className="flex items-center justify-center gap-12 h-full px-4">
      <div className="max-w-md w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-normal font-display py-2 tracking-tight">
            Connect a GitHub Repository
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("projectName", { required: true })}
            placeholder="Enter project name (e.g., Portfolio App)"
          />
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="GitHub Repo URL (e.g., https://github.com/user/repo)"
          />
          {/* <Input
            {...register("githubToken")}
            placeholder="Personal Access Token (optional)"
          /> */}
          <Button
            type="submit"
            disabled={createProject.isPending}
            className="w-full mt-6 bg-secondary/80 text-green-800 hover:bg-secondary hover:text-green-900 transition-colors"
          >
            {createProject.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Analyzing Repository...</span>
              </>
            ) : (
              "Analyze Repository"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
