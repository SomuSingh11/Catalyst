import { indexGithubRepoWithSSE } from "@/lib/github/indexer-sse";
import { IndexingProgress } from "@/types/gitWhiz";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid projectId" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const project = await prisma.whizProject.findUnique({
      where: { id: projectId },
      select: { id: true, githubUrl: true, githubToken: true, status: true },
    });

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (project.status === "completed") {
      return new Response(
        JSON.stringify({ error: "Project already indexed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (project.status === "processing") {
      return new Response(JSON.stringify({ error: "Already processing" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mmodern way to handle streams in the App Router
    const stream = new ReadableStream({
      async start(controller) {
        const onProgress = (progress: IndexingProgress) => {
          const data = JSON.stringify({
            ...progress,
            timestamp: new Date().toISOString(),
            projectId: projectId,
          });
          controller.enqueue(`data: ${data}\n\n`);
        };

        // Handle client disconnects
        req.signal.onabort = () => {
          console.log(`Client disconnected from indexing stream: ${projectId}`);
          // You can add logic here to gracefully stop the indexing if needed
          controller.close();
        };

        try {
          // Send initial confirmation
          onProgress({
            status: "connected",
            message: `Connected to indexing stream`,
            percentage: 0,
          });

          // Await the main indexing function
          await indexGithubRepoWithSSE(
            project.id,
            project.githubUrl,
            onProgress
          );
        } catch (error) {
          console.error("Error during indexing:", error);
          onProgress({
            status: "error",
            message: "Indexing failed due to an unexpected error",
            error: (error as Error).message || "Unknown error occurred",
            percentage: 0,
          });
        } finally {
          // Close the stream when the process is complete
          controller.close();
        }
      },
    });

    // Return the stream with the correct SSE headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Database error in indexer API:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
