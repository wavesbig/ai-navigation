import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Setting } from '@prisma/client';

export interface SettingItem {
  key: string;
  value: string;
}

// Helper function to create AjaxResponse
const AjaxResponse = {
  ok: (data: any) => ({ success: true, data }),
  fail: (message: string) => ({ success: false, message })
};

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    
    // Transform settings to a consistent format
    const formattedSettings = settings.map((setting) => ({
      key: setting.key,
      value: setting.value
    }));

    return NextResponse.json(AjaxResponse.ok(formattedSettings));
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      AjaxResponse.fail("Failed to fetch settings"),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || !body.key || body.value === undefined) {
      return NextResponse.json(
        AjaxResponse.fail("Invalid request body"),
        { status: 400 }
      );
    }

    const { key, value } = body;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });

    return NextResponse.json(AjaxResponse.ok(setting));
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json(
      AjaxResponse.fail("Failed to save setting"),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        AjaxResponse.fail("Missing required parameter: key"),
        { status: 400 }
      );
    }

    await prisma.setting.delete({
      where: { key },
    });

    return NextResponse.json(AjaxResponse.ok(null));
  } catch (error) {
    console.error("Failed to delete setting:", error);
    return NextResponse.json(
      AjaxResponse.fail("Failed to delete setting"),
      { status: 500 }
    );
  }
} 