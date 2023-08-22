import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/drizzle";
import { User, UsersTable } from "@/lib/schema/adminSchema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const POST = async (request: NextRequest) => {
  const { email, password }: User = await request.json();
  try {
    const users = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));

    if (!users) {
      throw new Error("Internal Server Error");
    }
    const requestedUser = users[0];

    if (!requestedUser) {
      throw new Error("User not found! Please sign up your account");
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      requestedUser.password
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid Password!");
    }

    if (requestedUser && isPasswordMatched) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const alg = "HS256";
      const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      const jwt = await new jose.SignJWT({ email })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(secret);

      cookies().set("token", jwt, {
        httpOnly: true,
      });

      return NextResponse.json({ message: "Login success" });
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
};
