"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsForm } from '@/components/news/news-form';

export default function SubmitNewsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">提交资讯</h1>
        <Link href="/news">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回资讯
          </Button>
        </Link>
      </div>
      <NewsForm />
    </motion.div>
  );
}