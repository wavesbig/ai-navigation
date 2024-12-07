import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AjaxResponse } from "../types";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");

  console.log("Authentication token:", token);

  if (!token) {
    console.log("Authentication token not found");
    return NextResponse.json(AjaxResponse.fail("Unauthorized", 401));
  }

  try {
    const isValidToken = verifyToken(token.value);

    if (!isValidToken) {
      return NextResponse.json(AjaxResponse.fail("Invalid token", 403));
    }

    const response = NextResponse.next();
    response.headers.set("X-Auth-Status", "authenticated");

    console.log("Authentication middleware executed");

    return response;
  } catch (error) {
    return NextResponse.json(AjaxResponse.fail("Authentication failed", 500));
  }
}

function verifyToken(token: string): boolean {
  // Implement actual token verification logic here
  return token.length > 0;
}

export const config = {
  matcher: ["/:path*"],
};
