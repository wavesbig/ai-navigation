import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BusinessError, ErrorCode } from "@/lib/errors/index";
import { AjaxResponse } from "../types";

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();
    return response;
  } catch (error) {
    if (error instanceof BusinessError) {
      console.error("Business error:", error.message);
      return NextResponse.json(
        AjaxResponse.fail(error.message, ErrorCode.SERVER_ERROR)
      );
    }
    // 系统错误原路返回
    throw error;
  }
}

export const config = {
  matcher: "/:path*",
};
