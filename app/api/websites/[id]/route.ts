import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/websites/[id]
// 获取单个网站
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const websiteId = parseInt(params.id);
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { category: true },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to fetch website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to fetch website"), {
      status: 500,
    });
  }
}

// DELETE /api/websites/[id]
// 删除网站
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const websiteId = parseInt(params.id);
    await prisma.website.delete({
      where: { id: websiteId },
    });
    return NextResponse.json(AjaxResponse.ok(null));
  } catch (error) {
    console.error("Failed to delete website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to delete website"), {
      status: 500,
    });
  }
}

// PUT /api/websites/[id]
// 更新网站
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const websiteId = parseInt(params.id);

    const existingWebsite = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!existingWebsite) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    if (!data.title || !data.url || !data.category_id) {
      return NextResponse.json(
        AjaxResponse.fail(
          "Missing required fields: title, url, or category_id"
        ),
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      return NextResponse.json(AjaxResponse.fail("Category does not exist"), {
        status: 400,
      });
    }

    const website = await prisma.website.update({
      where: { id: websiteId },
      data: {
        title: data.title,
        url: data.url,
        description: data.description || "",
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail || "",
        status: data.status || existingWebsite.status,
      },
    });

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to update website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to update website"), {
      status: 500,
    });
  }
}
