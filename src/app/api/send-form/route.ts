import { NextRequest, NextResponse } from "next/server";
import type { IQuestion } from "@/app/create-form/page";
import { NewQuestion, QuestionsTable } from "@/lib/schema/questionSchema";
import { db } from "@/lib/drizzle";
import { cookies } from "next/headers";
import * as jose from "jose";
import { formDetailsTable } from "@/lib/schema/formDetailsSchema";

export interface IFormData {
  questions: IQuestion[];
  formDetails: {
    title: string;
    description: string;
  };
}

export async function POST(request: NextRequest) {
  const token = cookies().get("token");
  const jwt = token!.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jose.jwtVerify(jwt, secret);
  const userEmail = payload.email as string;
  const body: IFormData = await request.json();
  const { questions, formDetails } = body;

  try {
    if (!questions.length || !formDetails) {
      throw new Error("No questions or form details passed!");
    }

    const forms = await db
      .insert(formDetailsTable)
      .values(formDetails)
      .returning();

    if (!forms) {
      throw new Error("Internal Server Error");
    }

    const form = forms[forms.length - 1];

    const questionsFromDB = questions.map(async (question) => {
      let insertQuestion: NewQuestion;
      insertQuestion = { adminEmail: userEmail, ...question, formId: form.id };
      const responses = await db
        .insert(QuestionsTable)
        .values(insertQuestion)
        .returning();
      console.log(responses)
      return responses;
    });

    if (!questionsFromDB.length) {
      throw new Error("Questions not inserted!");
    }

    return NextResponse.json({
      message: "Form created successfully!",
      email: payload.email,
      form,
      questionsFromDB
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
