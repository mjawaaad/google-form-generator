import { db } from "@/lib/drizzle";
import { NewResponse, ResponsesTable } from "@/lib/schema/answerResponses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { adminEmail: string; id: string } }
) {
  const userResponse: { [x: string]: string } = await request.json();
  const userEmail = userResponse.email;

  try {
    if (!userResponse) {
      throw new Error("Please answer all the questions");
    }

    if (!userEmail) {
      throw new Error("Please enter email!");
    }

    Object.entries(userResponse).map(async ([question, answer]) => {
      const response: NewResponse = {
        email: userEmail,
        question: question,
        answer: answer,
        adminEmail: params.adminEmail,
        formId: Number(params.id),
      };
      const responsesFromDB = await db
        .insert(ResponsesTable)
        .values(response)
        .returning();
      if (!responsesFromDB[0]) {
        throw new Error();
      }
      return responsesFromDB;
    });

    return NextResponse.json({
      message: " Your form has been submitted!",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
