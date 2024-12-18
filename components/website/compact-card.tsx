"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardHoverVariants } from '@/lib/animations';
import type { Website } from '@/lib/types';
import { useState } from 'react';
import { WebsiteThumbnail } from './website-thumbnail';
import { toast } from "@/hooks/use-toast"

interface CompactCardProps {
  website: Website;
  onVisit: (website: Website) => void;
}

export function CompactCard({ website, onVisit }: CompactCardProps) {
  const [likes, setLikes] = useState(website.likes);

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
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      layout
    >
      <Card className={cn(
        "group relative overflow-hidden h-full",
        "bg-gradient-to-br from-background to-muted/30",
        "border-black/5 dark:border-white/5",
        "hover:border-primary/20 dark:hover:border-primary/20",
        "transition-all duration-300",
        "website-card"
      )}>
        <div className="relative p-3 flex flex-col gap-2 h-full">
          {/* Icon and Title */}
          <div className="flex items-center gap-2 min-w-0">
            <WebsiteThumbnail url={website.url} thumbnail={website.thumbnail} title={website.title} />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {website.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {website.description}
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{website.visits}访问</span>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{likes}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={cn(
                  "h-7 w-7 p-0",
                  "hover:text-red-500"
                )}
              >
                <motion.div
                  whileTap={{ scale: 1.4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className="h-3.5 w-3.5" />
                </motion.div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVisit(website)}
                className="h-7 w-7 p-0 hover:text-primary"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}