import { endGameSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request){
    try {
        const body = await req.json();
        const { quizzyId } = endGameSchema.parse(body); 

        const quiz = await prisma?.quizzy.findUnique({
            where:{
                id: quizzyId
            }
        });
        if(!quiz) {
            return NextResponse.json({
                message: "Quiz not found"
            },
            {
                status: 404
            });
        }

        await prisma.quizzy.update({
            where: {
                id: quizzyId
            },
            data: {
                timeEnded: new Date()
            }
        });

        return NextResponse.json({
            message: "Quiz Ended"
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Something went wrong"
            },
            {
                status: 500
            }
        );
    }
}