"use client";

import { motion } from "framer-motion";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import { Heart, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";

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
    const method = "POST";
    const response = await fetch(`/api/websites/${website.id}/like`, {
      method,
    });
    if (response.ok) {
      localStorage.setItem(key, "true");
      setLikes(likes + 1);
    }
  };

  return (
    <div ref={cardRef} {...tiltProps} className="card-container">
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
      >
        <Card
          className={cn(
            "group relative flex flex-col overflow-hidden",
            "bg-background/30 backdrop-blur-md backdrop-saturate-150",
            "border-primary/15 dark:border-white/10",
            "hover:border-primary/20 dark:hover:border-primary/20",
            "hover:bg-background/50 hover:backdrop-blur-xl",
            "shadow-sm hover:shadow-lg",
            "transition-colors duration-300",
            "rounded-2xl sm:rounded-lg"
          )}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

          {/* Content */}
          <div className="relative py-2 px-3 sm:p-3 flex items-center gap-3">
            <WebsiteThumbnail
              url={website.url}
              thumbnail={website.thumbnail}
              title={website.title}
              className="w-9 h-9 sm:w-10 sm:h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-sm flex-1 truncate group-hover:text-primary transition-colors">
                  {website.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{likes}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVisit(website)}
                className={cn(
                  "h-8 w-8 p-0",
                  "bg-background/50 backdrop-blur-sm border-white/20",
                  "hover:bg-background/60 hover:border-primary/30 hover:text-primary",
                  "transition-all duration-300"
                )}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "h-8 w-8 p-0",
                  "bg-background/50 backdrop-blur-sm border-white/20",
                  "hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500",
                  "transition-all duration-300"
                )}
              >
                <motion.div
                  whileTap={{ scale: 1.4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
