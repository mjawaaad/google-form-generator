import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
cookies;
import { QuestionsTable } from "@/lib/schema/questionSchema";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { formDetailsTable } from "@/lib/schema/formDetailsSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { adminEmail: string; id: string } }
) {
  try {
    const email = params.adminEmail;
    const formId = Number(params.id);
    const questions = await db
      .select()
      .from(QuestionsTable)
      .where(
        and(
          eq(QuestionsTable.adminEmail, email!),
          eq(QuestionsTable.formId, formId)
        )
      );

    if (!questions.length) {
      throw new Error("Internal Server Error");
    }

    const formDetailsData = await db
      .select()
      .from(formDetailsTable)
      .where(eq(formDetailsTable.id, formId));
    const formDetails = formDetailsData[0];

    return NextResponse.json({ questions, formDetails });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
