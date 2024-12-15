"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtomValue, useAtom } from 'jotai';
import { isAdminModeAtom, isCompactModeAtom, websitesAtom } from '@/lib/atoms';
import { useToast } from '@/hooks/use-toast';
import { WebsiteCard } from './website-card';
import { CompactCard } from './compact-card';
import { ViewModeToggle } from './view-mode-toggle';
import { cn } from '@/lib/utils';
import type { Website, Category } from '@/lib/types';

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
  onVisit: (website: Website) => void;
}

export default function WebsiteGrid({ websites, categories, onVisit }: WebsiteGridProps) {
  const isAdmin = useAtomValue(isAdminModeAtom);
  const { toast } = useToast();
  const [isCompact, setIsCompact] = useAtom(isCompactModeAtom);
  const [_ , setWebsites] = useAtom(websitesAtom);
  
  

  // 不需要等待，直接打开网站
  const handleVisit = async (website: Website) => {
    fetch(`/api/websites/${website.id}/visit`, { method: 'POST' })
    window.open(website.url, '_blank');
  };

  const handleStatusUpdate = async (id: number, status: Website['status']) => {
    const response = fetch(`/api/websites/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    setWebsites(websites.map(website => website.id === id ? { ...website, status } : website));
    toast({
      title: '状态已更新',
      description: status === 'approved' ? '网站已通过审核' : '网站已被拒绝',
    });

  };

  if (!websites || websites.length === 0) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[500px]"
      layout
    >
      <ViewModeToggle isCompact={isCompact} onChange={setIsCompact} />

      <motion.div
        layout
        className={cn(
          "grid gap-4 auto-rows-fr",
          isCompact 
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        <AnimatePresence mode="popLayout">
          {websites.map((website) => (
            <motion.div
              key={website.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {isCompact ? (
                <CompactCard
                  website={website}
                  onVisit={handleVisit}
                />
              ) : (
                <WebsiteCard
                  website={website}
                  category={categories.find(c => c.id === website.category_id)}
                  isAdmin={isAdmin}
                  onVisit={handleVisit}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}