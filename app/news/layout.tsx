"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/news/submit">
          <Button className="rounded-full shadow-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            提交资讯
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}