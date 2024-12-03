import { NextResponse } from 'next/server';
import { addWebsite } from '@/lib/db';
import type { Website } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 添加网站
    const website = await addWebsite({
      title: data.title,
      url: data.url,
      description: data.description,
      category_id: data.category_id,
      thumbnail: data.thumbnail,
      status: 'pending',
    });

    return NextResponse.json({ success: true, website });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit website' },
      { status: 500 }
    );
  }
}