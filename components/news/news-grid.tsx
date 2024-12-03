"use client";

import { motion } from 'framer-motion';
import { NewsCard } from './news-card';
import type { NewsItem } from '@/lib/types';

interface NewsGridProps {
  news: NewsItem[];
}

const container = {
  show: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function NewsGrid({ news }: NewsGridProps) {
  if (news.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-lg text-muted-foreground">暂无资讯</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {news.map((item) => (
        <motion.div
          key={item.id}
          variants={item}
          layout
        >
          <NewsCard news={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}