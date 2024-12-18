"use client";

import { useAtom } from 'jotai';
import { websitesAtom } from '@/lib/atoms';
import { Rankings } from '@/components/website/rankings';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function RankingsPage() {
  const [websites] = useAtom(websitesAtom);

  const handleVisit = async (website: any) => {
    try {
      fetch(`/api/websites/${website.id}/visit`, { method: 'POST' });
      window.open(website.url, '_blank');
    } catch (error) {
      console.error('Failed to record visit:', error);
      window.open(website.url, '_blank');
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
              className="relative"
            >
              <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full" />
              <Trophy className="h-16 w-16 text-primary relative" />
            </motion.div>
            <div className="space-y-2">
              <motion.h1 
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                网站排行榜
              </motion.h1>
              <motion.p 
                className="text-muted-foreground max-w-[600px]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                发现最受欢迎的AI工具和网站，基于用户访问量和点赞数据实时更新
              </motion.p>
            </div>
          </div>

          {/* Rankings Section */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Rankings websites={websites} onVisit={handleVisit} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 