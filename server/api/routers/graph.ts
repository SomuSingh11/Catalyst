import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TreeSitterParser } from "@/lib/parser/engines/tree-sitter-engine";
import { ParseResult } from "@/types/parser";
import { RelationshipBuilder } from "@/lib/graph/relationship-builder";
import { transformToReactFlow } from "@/lib/graph/transformer";

const parser = new TreeSitterParser();

export const graphRouter = createTRPCRouter({
  generateGraph: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { projectId } = input;

      const sourceFiles = await ctx.db.sourceCodeEmbedding.findMany({
        where: { whizProjectId: projectId },
        select: { fileName: true, sourceCode: true },
      });

      if (!sourceFiles || sourceFiles.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No source files found for this project",
        });
      }

      console.log(
        `[Graph API] Parsing ${sourceFiles.length} files for project ${projectId}...`
      );

      const parsePromises = sourceFiles.map(async (file) => {
        try {
          const result = await parser.parse(file.fileName, file.sourceCode);
          return result;
        } catch (error) {
          console.error(`Failed to parse ${file.fileName}:`, error);
          return null;
        }
      });

      const rawResults = await Promise.all(parsePromises);

      const validResults: ParseResult[] = rawResults.filter(
        (result): result is ParseResult => result !== null
      );

      console.log(
        `[Graph API] Successfully parsed ${validResults.length} files.`
      );

      //console.dir(validResults, { depth: null });

      const relBuilder = new RelationshipBuilder(validResults);
      const relationships = relBuilder.build();

      const graphData = transformToReactFlow(validResults, relationships);
      //console.dir(graphData.edges, { depth: null });

      return {
        success: true,
        nodes: graphData.nodes,
        edges: graphData.edges,
      };
    }),
});
