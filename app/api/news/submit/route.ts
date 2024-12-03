import { NextResponse } from 'next/server';
import { addNews } from '@/lib/db';
import type { NewsItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 添加资讯
    const news = await addNews({
      title: data.title,
      summary: data.summary,
      source: data.source || new URL(data.sourceUrl).hostname,
      sourceUrl: data.sourceUrl,
      publishDate: new Date().toISOString(),
      thumbnail: data.thumbnail,
      tags: data.tags || [],
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit news' },
      { status: 500 }
    );
  }
}