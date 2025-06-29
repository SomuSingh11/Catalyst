"use client";

import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react'; // tRPC API client
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useProject from '@/hooks/use-project';
import { Loader2 } from 'lucide-react';


type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.whizProject.createProject.useMutation(); // Create mutation hook using tRPC to send createProject mutation
  const utils = api.useUtils();
  const router = useRouter();
  const {setProjectId} = useProject();

  function onSubmit(data: FormInput) {
    console.log(data);
    createProject.mutate({
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken
    }, {
        onSuccess: (createdProject) => {
            toast.success("Project created successfully");
            utils.whizProject.getProjects.invalidate();
            reset();
            setProjectId(createdProject.id);
            router.push('/gitwhiz/dashboard');
        }, 
        onError: () => {
            toast.error("Error while creating project")
        }
    })
    return true;
  }

  return (
    <div className="flex items-center justify-center gap-12 h-full px-4">
      <Image
        src="/codeCreate.gif"
        alt="Code integration illustration"
        width={500}
        height={500}
      />

      <div className="max-w-md w-full">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">Connect a GitHub Repository</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start by linking a GitHub repo. GitWhiz will use this to generate insights and dashboards.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            {...register("projectName", { required: true })}
            placeholder="Enter project name (e.g., Portfolio App)"
          />
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="GitHub Repo URL (e.g., https://github.com/user/repo)"
          />
          <Input
            {...register("githubToken")}
            placeholder="Personal Access Token (optional)"
          />
          <Button type="submit" disabled={createProject.isPending} className="w-full mt-2">
            {createProject.isPending ? <Loader2 className='animate-spin'/> : "Link Repository"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
