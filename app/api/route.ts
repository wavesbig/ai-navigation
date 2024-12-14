import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/types";

export async function GET(request: Request) {
  try {
    return NextResponse.json(AjaxResponse.ok("ok"));
  } catch (error) {
    return NextResponse.json(AjaxResponse.fail("Failed to process request"), {
      status: 500,
    });
  }
}
