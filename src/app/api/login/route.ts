import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const username = process.env.ADMIN_USERNAME || "admin";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const storedPassword = process.env.ADMIN_PASSWORD;

    if (!storedPassword || storedPassword !== password) {
      return NextResponse.json(AjaxResponse.fail("用户名或密码错误"), {
        status: 401,
      });
    }

    const token = generateToken(username);

    const cookie = await cookies();
    cookie.set("auth_token", token, { httpOnly: true, sameSite: "lax" });

    return NextResponse.json(AjaxResponse.ok("登录成功"));
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(AjaxResponse.fail("登录失败"), { status: 500 });
  }
}

function generateToken(username: string) {
  const payload = { username, iat: Date.now() };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
