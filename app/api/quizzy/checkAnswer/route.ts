import prisma from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity"


export async function POST(req : Request, res : Response){
try {
    const body = await req.json();
    const parsedBody = checkAnswerSchema.parse(body);
    const questionId = parsedBody.questionId;
    const userAnswer = parsedBody.userAnswer;

    const question = await prisma?.quizzyQuestion.findUnique({
        where: {
            id: questionId
        }
    });

    if(!question){
        return NextResponse.json(
            {
                error: "Question not found"
            },
            {
                status: 404
            }
        )
    }

    await prisma?.quizzyQuestion.update({
        where: {
            id: questionId,
        },
        data: {
            userAnswer: userAnswer
        }
    })

    if(question.questionType === "mcq"){
        const isCorrect = question.answer.toLocaleLowerCase().trim() === userAnswer.toLocaleLowerCase().trim();
        await prisma?.quizzyQuestion.update({
            where: {
                id: questionId,
            },
            data:{
                isCorrect: isCorrect
            }
        })

        return NextResponse.json({
            message: "Answer submitted successfully",
            isCorrect: isCorrect,
        }, {
            status: 200
        })
    } else if (question.questionType === "open_ended"){
        let percentageCorrect = compareTwoStrings(question.answer.toLocaleLowerCase().trim(), userAnswer.toLocaleLowerCase().trim());
        percentageCorrect = Math.round(percentageCorrect * 100);

        await prisma.quizzyQuestion.update({
            where: {
                id: questionId
            },
            data: {
                percentageCorrect: percentageCorrect
            }
        })
        return NextResponse.json({
            message: "Answer submitted successfully",
            percentageCorrect: percentageCorrect
        }, {
            status: 200
        })
    }

} catch (error) {
    if(error instanceof ZodError){
        return NextResponse.json(
            {
                error: error.issues
            },
            {
                status: 400
            }
        )
    }
}
}