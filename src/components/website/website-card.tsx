"use client";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Globe,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website, Category } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website["status"]) => void;
}

export function WebsiteCard({
  website,
  category,
  isAdmin,
  onVisit,
  onStatusUpdate,
}: WebsiteCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const { cardRef, tiltProps } = useCardTilt();

  const statusColors: Record<Website["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    all: "",
  };

  const statusText: Record<Website["status"], string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    all: "",
  };

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();

    if (lastLiked) {
      const lastLikedTime = parseInt(lastLiked);
      const oneDay = 24 * 60 * 60 * 1000; // 24小时的毫秒数

      if (now - lastLikedTime < oneDay) {
        toast({
          title: "已点赞",
          description: "每天只能点赞一次哦，明天再来吧 (｡•́︿•̀｡)",
        });
        return;
      }
    }

    const method = "POST";
    fetch(`/api/websites/${website.id}/like`, { method });
    localStorage.setItem(key, now.toString());
    setLikes(likes + 1);
  };

  return (
    <div ref={cardRef} {...tiltProps} className="h-[220px] card-container">
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
        className="h-full"
      >
        <Card
          className={cn(
            "group relative h-full flex flex-col overflow-hidden",
            "bg-background/30 backdrop-blur-md backdrop-saturate-150",
            "border-primary/15 dark:border-white/10",
            "hover:border-primary/20 dark:hover:border-primary/20",
            "hover:bg-background/70 hover:backdrop-blur-xl",
            "shadow-sm hover:shadow-lg",
            "transition-colors duration-300"
          )}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

          {/* Website Icon and Status */}
          <div className="relative p-3 flex items-center justify-between card-content">
            <div className="flex items-center gap-3 max-w-[75%]">
              <WebsiteThumbnail
                url={website.url}
                thumbnail={website.thumbnail}
                title={website.title}
              />
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {website.title}
                </h3>
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-normal text-xs",
                    statusColors[website.status]
                  )}
                >
                  {statusText[website.status]}
                </Badge>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-normal bg-background/50 backdrop-blur-sm shrink-0"
            >
              {category?.name || "未分类"}
            </Badge>
          </div>

          {/* Description */}
          <div className="relative px-3 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {website.description}
            </p>
          </div>

          {/* Stats */}
          <div className="relative px-3 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/5">
            <div className="flex items-center gap-3">
              <span>{website.visits} 次访问</span>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{likes}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="relative p-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVisit(website)}
              className={cn(
                "flex-1 h-8",
                "bg-background/50 backdrop-blur-sm border-white/20",
                "hover:bg-background/60 hover:border-primary/30 hover:text-primary",
                "transition-all duration-300"
              )}
            >
              <span className="flex-1">访问网站</span>
              <ArrowUpRight className="h-4 w-4 ml-1" />
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

            {isAdmin && website.status !== "approved" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(website.id, "approved")}
                className={cn(
                  "h-8 px-2",
                  "bg-background/50 backdrop-blur-sm border-white/20",
                  "hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-500",
                  "transition-all duration-300"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            )}

            {isAdmin && website.status !== "rejected" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onStatusUpdate(website.id, "rejected");
                }}
                className={cn(
                  "h-8 px-2",
                  "bg-background/50 backdrop-blur-sm border-white/20",
                  "hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500",
                  "transition-all duration-300"
                )}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
