"use client";

import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { isAdminModeAtom } from '@/lib/atoms';
import { updateWebsiteStatus, incrementVisits } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { WebsiteCard } from './website-card';
import type { Website, Category } from '@/lib/types';

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
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

export default function WebsiteGrid({ websites, categories }: WebsiteGridProps) {
  const isAdmin = useAtomValue(isAdminModeAtom);
  const { toast } = useToast();

  const handleVisit = (website: Website) => {
    incrementVisits(website.id);
    window.open(website.url, '_blank');
  };

  const handleStatusUpdate = (id: number, status: Website['status']) => {
    updateWebsiteStatus(id, status);
    toast({
      title: '状态已更新',
      description: status === 'approved' ? '网站已通过审核' : '网站已被拒绝',
    });
  };

  if (websites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-lg text-muted-foreground">暂无网站</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {websites.map((website) => (
        <motion.div
          key={website.id}
          variants={item}
          layout
        >
          <WebsiteCard
            website={website}
            category={categories.find(c => c.id === website.category_id)}
            isAdmin={isAdmin}
            onVisit={handleVisit}
            onStatusUpdate={handleStatusUpdate}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}