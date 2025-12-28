import prisma from "@/lib/db";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";

import { ZodError } from "zod";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { currentProfile } from "@/lib/auth/current-profile";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { getToken } = await auth();
  const profile = await currentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    const quizzy = await prisma.quizzy.create({
      data: {
        userId: profile.id,
        topic,
        gameType: type,
        timeStarted: new Date(),
      },
    });

    console.log("Making request to questions API with:", {
      amount,
      type,
      topic,
      url: `${process.env.API_URL}/api/quizzy/questions`,
    });

    const { data } = await axios.post(
      `${process.env.API_URL}/api/quizzy/questions`,
      { amount, topic, type },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token here
          "Content-Type": "application/json",
        },
      }
    );

    if (type == "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          quizzyId: quizzy.id,
          questionType: "mcq",
        };
      });

      await prisma.quizzyQuestion.createMany({
        data: manyData,
      });
    } else if (type == "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };

      const manyData = data.questions.map((question: openQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          quizzyId: quizzy.id,
          questionType: "open_ended",
        };
      });

      await prisma.quizzyQuestion.createMany({
        data: manyData,
      });
    }

    return NextResponse.json({
      quizzyId: quizzy.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        {
          error: "Something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  }
}
