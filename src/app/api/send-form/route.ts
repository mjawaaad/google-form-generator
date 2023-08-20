import { NextRequest } from "next/server";
import type { IQuestion } from "@/app/create-form/page";

interface FormData {
  questions: IQuestion[];
  formDetails: {
    title: string;
    description: string;
  };
}

export async function POST(request: NextRequest) {
  const body: FormData = await request.json();
}
