"use client";

import { useAtom } from 'jotai';
import { websitesAtom } from '@/lib/atoms';
import { Rankings } from '@/components/website/rankings';
import { motion, useReducedMotion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RankingsPage() {
  const [websites] = useAtom(websitesAtom);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVisit = async (website: any) => {
    try {
      fetch(`/api/websites/${website.id}/visit`, { method: 'POST' });
      window.open(website.url, '_blank');
    } catch (error) {
      console.error('Failed to record visit:', error);
      window.open(website.url, '_blank');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: isMobile ? {
      opacity: 1,
      transition: { duration: 0.3 }
    } : {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: isMobile ? {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    } : {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  // If user prefers reduced motion, disable all animations
  if (prefersReducedMotion) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
                <Trophy className="h-16 w-16 text-primary relative" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  网站排行榜
                </h1>
                <p className="text-muted-foreground max-w-[600px]">
                  发现最受欢迎的AI工具和网站，基于用户访问量和点赞数据实时更新
                </p>
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <Rankings websites={websites} onVisit={handleVisit} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center">
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
              <Trophy className="h-16 w-16 text-primary relative" />
            </motion.div>
            <motion.div 
              className="space-y-2"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                网站排行榜
              </h1>
              <p className="text-muted-foreground max-w-[600px]">
                发现最受欢迎的AI工具和网站，基于用户访问量和点赞数据实时更新
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Rankings websites={websites} onVisit={handleVisit} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 