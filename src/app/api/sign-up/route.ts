import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

import { NewUser, UsersTable } from "@/lib/schema/adminSchema";
export async function POST(request: NextRequest) {
  const { fullName, email, password, confirmPassword } = await request.json();

  try {
    if (!email || !password || !fullName || !confirmPassword) {
      throw new Error("Fields are empty!");
    }
    if (email.length > 1000) {
      throw new Error("Invalid email length!");
    }
    if (password !== confirmPassword) {
      throw new Error("Password not matched!");
    }

    const encryptedPassword = await bcrypt
      .hash(password, 10)
      .then((hash) => hash);

    const admin: NewUser = {
      fullName,
      email,
      password: encryptedPassword,
    };

    const oldUsers = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));

    if (!oldUsers) {
      throw new Error("Internal Server Error");
    }

    const oldUser = oldUsers[0];

    if (oldUser) {
      throw new Error("User already exist with this email address");
    }

    const users = await db.insert(UsersTable).values(admin).returning();

    return NextResponse.json({
      message: "Successfully Registered!",
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
