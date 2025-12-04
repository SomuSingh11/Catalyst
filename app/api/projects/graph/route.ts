import { RelationshipBuilder } from "@/lib/graph/relationship-builder";
import { transformToReactFlow } from "@/lib/graph/transformer";
import { TreeSitterParser } from "@/lib/parser/engines/tree-sitter-engine";
import { ParseResult } from "@/types/parser";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const parser = new TreeSitterParser();

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { projectId } = body;

    if (!projectId)
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );

    const sourceFiles = await prisma?.sourceCodeEmbedding.findMany({
      where: { whizProjectId: projectId },
      select: { fileName: true, sourceCode: true },
    });

    if (!sourceFiles || sourceFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No source files found for this project" },
        { status: 404 }
      );
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

    const relBuilder = new RelationshipBuilder(validResults);
    const relationships = relBuilder.build();

    const graphData = transformToReactFlow(validResults, relationships);

    return NextResponse.json({
      success: true,
      nodes: graphData.nodes,
      edges: graphData.edges,
    });
  } catch (error) {
    console.error("[Graph API] Critical error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
