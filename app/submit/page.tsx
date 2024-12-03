"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebsiteForm } from '@/components/forms/website-form';

export default function SubmitPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">提交网站</h1>
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回主页
          </Button>
        </Link>
      </div>
      <WebsiteForm />
    </motion.div>
  );
}