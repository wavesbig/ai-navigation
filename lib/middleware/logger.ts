import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  const body = await request.text();
  console.log(
    `${request.method} ${request.url} 请求参数：${searchParams} 请求体：${body}`
  );
}

export const config = {
  matcher: "/",
};
