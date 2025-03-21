import { AjaxResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

interface CheckUrlResponse {
  isAlive: boolean;
}

async function checkUrl(url: string): Promise<CheckUrlResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);
    return {
      isAlive: response.ok,
    };
  } catch {
    return {
      isAlive: false,
    };
  }
}

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json(AjaxResponse.fail("url必须传递"));
  }
  try {
    const result = await checkUrl(url);
    return NextResponse.json(AjaxResponse.ok(result));
  } catch {
    return NextResponse.json(AjaxResponse.fail("获取页脚链接失败"));
  }
}
