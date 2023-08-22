import { ResponsesTable } from "@/lib/schema/answerResponses";
import { formDetailsTable } from "@/lib/schema/formDetailsSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const responses = await db
      .select()
      .from(ResponsesTable)
      .where(eq(ResponsesTable.formId, Number(params.id)));
    console.log(responses);
    if (!responses) {
      throw new Error("Internal Server Error");
    }

    return NextResponse.json({
      responses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
