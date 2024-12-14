import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 获取所有页脚链接
export async function GET() {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: '获取页脚链接失败' },
      { status: 500 }
    );
  }
}

// 创建新的页脚链接
export async function POST(request: Request) {
  try {
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: '标题和URL都是必需的' },
        { status: 400 }
      );
    }

    // 验证 URL 格式
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: '请输入有效的URL地址' },
        { status: 400 }
      );
    }

    const link = await prisma.footerLink.create({
      data: {
        title,
        url,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: '该URL已存在' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '创建页脚链接失败' },
      { status: 500 }
    );
  }
}

// 更新页脚链接
export async function PUT(request: Request) {
  try {
    const { id, title, url } = await request.json();

    if (!id || !title || !url) {
      return NextResponse.json(
        { error: 'ID、标题和URL都是必需的' },
        { status: 400 }
      );
    }

    const link = await prisma.footerLink.update({
      where: { id },
      data: {
        title,
        url,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: '更新页脚链接失败' },
      { status: 500 }
    );
  }
}

// 删除页脚链接
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少ID参数' },
        { status: 400 }
      );
    }

    await prisma.footerLink.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: '删除页脚链接失败' },
      { status: 500 }
    );
  }
} 