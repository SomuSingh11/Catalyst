/* eslint-disable @typescript-eslint/no-unused-vars */
import { strict_output } from "@/lib/gemini";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: Request, res: Response) {
  return NextResponse.json({
    hello: "world",
  });
}

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);
    console.log("Inputs:", { amount, topic, type });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let questions: any;
    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers. Each answer should not exceed 15 words.",
        new Array(amount).fill(
          `You are to generate random open-ended question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }

    if (!questions || questions.length === 0) {
      throw new Error("Failed to generate questions");
    }

    return NextResponse.json(
      {
        questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating questions:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    } else {
      console.log("gemini-error", error);
      return NextResponse.json(
        {
          error: "Failed to generate questions",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        {
          status: 500,
        }
      );
    }
  }
}
