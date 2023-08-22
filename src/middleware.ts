import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let jwt = request.cookies.get("token")?.value;
  const cookie = request.cookies.get("adminEmail")?.value;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const url = request.nextUrl.clone();
  url.pathname = "/sign-up";
  if (!jwt) {
    return NextResponse.redirect(url);
  } else {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
    const headers = new Headers(request.headers);
    headers.set("user", JSON.stringify(payload.email));

    return NextResponse.next({
      request: {
        headers: headers,
      },
    });
  }
}

export const config = {
  matcher: ["/create-form/:path*", "/get-form-responses/:path*"],
};
