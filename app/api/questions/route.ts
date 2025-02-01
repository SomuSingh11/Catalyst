import prisma from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    if (req.method === "GET") {
      // Fetch questions from Prisma
      const questions = await prisma.leetcodeQuestion.findMany();
      return new NextResponse(JSON.stringify(questions), { status: 200 });
    }

    // If method is not GET, return 405 Method Not Allowed
    return new NextResponse(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
