"use client";

import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { isAdminModeAtom, categoriesAtom } from '@/lib/store';
import { updateWebsiteStatus, incrementVisits } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { WebsiteCard } from './website/website-card';
import type { Website } from '@/lib/types';

interface WebsiteGridProps {
  websites: Website[];
}

export default function WebsiteGrid({ websites }: WebsiteGridProps) {
  const isAdmin = useAtomValue(isAdminModeAtom);
  const categories = useAtomValue(categoriesAtom);
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
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">暂无网站</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {websites.map((website, index) => (
        <motion.div
          key={website.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
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
    </div>
  );
}