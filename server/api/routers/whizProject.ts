import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { pollCommits } from "@/lib/github/commits";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dbUser = await ctx.db.user.findUnique({
        where: { userId: ctx.user.userId! },
        select: { id: true },
      });

      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      try {
        const project = await ctx.db.whizProject.create({
          data: {
            githubUrl: input.githubUrl,
            githubToken: input.githubToken,
            name: input.name,
            status: "pending",
            userToProjects: {
              create: {
                userId: dbUser.id,
              },
            },
          },
        });

        // await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        // await indexGithubRepo(project.id, input.githubUrl);
        pollCommits(project.id);
        return { project, indexingUrl: `/api/indexer?projectId=${project.id}` };
      } catch (error) {
        console.error("Error creating project:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create project",
        });
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const dbUser = await ctx.db.user.findUnique({
      where: { userId: ctx.user.userId! },
      select: { id: true },
    });

    if (!dbUser) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return await ctx.db.whizProject.findMany({
      where: {
        userToProjects: {
          some: {
            userId: dbUser.id,
          },
        },
        deletedAt: null,
      },
    });
  }),

  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      pollCommits(input.projectId).then().catch(console.error);
      return await ctx.db.whizCommit.findMany({
        where: {
          whizProjectId: input.projectId,
        },
      });
    }),

  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dbUser = await ctx.db.user.findUnique({
        where: { userId: ctx.user.userId! },
        select: { id: true },
      });

      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return await ctx.db.whizSavedQuestion.create({
        data: {
          answer: input.answer,
          filesReferences: input.filesReferences,
          whizProjectId: input.projectId,
          question: input.question,
          userId: dbUser.id,
        },
      });
    }),

  getSavedQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.whizSavedQuestion.findMany({
        where: {
          whizProjectId: input.projectId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  archieveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.whizProject.update({
        where: {
          id: input.projectId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),

  getSourceFiles: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dbUser = await ctx.db.user.findUnique({
        where: { userId: ctx.user.userId! },
        select: { id: true },
      });

      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return await ctx.db.sourceCodeEmbedding.findMany({
        where: { whizProjectId: input.projectId },
      });
    }),
});
