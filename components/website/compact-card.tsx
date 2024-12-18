"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardHoverVariants, sharedLayoutTransition } from '@/lib/animations';
import type { Website } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { WebsiteThumbnail } from './website-thumbnail';
import { toast } from "@/hooks/use-toast"
import { useCardTilt } from '@/lib/hooks/use-card-tilt';

interface CompactCardProps {
  website: Website;
  onVisit: (website: Website) => void;
}

export function CompactCard({ website, onVisit }: CompactCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const { cardRef, tiltProps } = useCardTilt({
    maxTiltDegree: 10, // 减小倾斜角度
    scale: 1.02, // 减小缩放比例
    transitionZ: 10, // 减小Z轴位移
  });

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    if (localStorage.getItem(key)) {
      toast({
        title: "已点赞",
        description: "你已经点赞了，请过段时间再来吧 (｡•́︿•̀｡)",
      });
      return;
    }
    const method = 'POST';
    const response = await fetch(`/api/websites/${website.id}/like`, { method });
    if (response.ok) {
      localStorage.setItem(key, 'true');
      setLikes(likes + 1);
    }
  };

  return (
    <div
      ref={cardRef}
      {...tiltProps}
      className="h-full card-container"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
      >
        <Card className={cn(
          "group relative h-full flex flex-col overflow-hidden",
          "bg-background/40 backdrop-blur-md backdrop-saturate-150",
          "border-white/20 dark:border-white/10",
          "hover:border-primary/20 dark:hover:border-primary/20",
          "hover:bg-background/50 hover:backdrop-blur-xl",
          "shadow-sm hover:shadow-lg",
          "transition-colors duration-300"
        )}>
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          {/* Content */}
          <div className="relative p-3 flex items-center gap-3">
            <WebsiteThumbnail url={website.url} thumbnail={website.thumbnail} title={website.title} size="sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {website.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {website.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onVisit(website)}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}