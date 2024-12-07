import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as loggerMiddleware from "@/lib/middleware/logger";
import * as authMiddleware from "@/lib/middleware/authorization";
import * as errorMiddleware from "@/lib/middleware/error";
import { AjaxResponse } from "./lib/types";

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");

  try {
    // Apply logger middleware
    await applyMiddleware(loggerMiddleware, request);

    // Apply auth middleware for specific API routes
    await applyMiddleware(authMiddleware, request);

    // // Apply error middleware
    // await applyMiddleware(errorMiddleware, request);

    return NextResponse.next();
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    throw error;
  }
}

async function applyMiddleware(middleware: any, request: NextRequest) {
  const response = await middleware.middleware(request);
  // 如果 中间件没有返回 NextResponse.next(), 则抛出他的响应或者错误
  if (response && response !== NextResponse.next()) {
    throw response;
  }
}

export const config = {
  matcher: "/api/:path*",
};
