import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/websites/[id]/like - Add like
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const websiteId = parseInt(params.id);
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(AjaxResponse.ok({ likes: updatedWebsite.likes }));
  } catch (error) {
    console.error("Failed to like website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to like website"), {
      status: 500,
    });
  }
}

// DELETE /api/websites/[id]/like - Remove like
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const websiteId = parseInt(params.id);
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { likes: { decrement: 1 } },
    });

    return NextResponse.json(AjaxResponse.ok({ likes: updatedWebsite.likes }));
  } catch (error) {
    console.error("Failed to unlike website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to unlike website"), {
      status: 500,
    });
  }
}
