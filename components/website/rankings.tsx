"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Trophy, ArrowUpRight, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Website } from '@/lib/types';

interface RankingsProps {
  websites: Website[];
  onVisit: (website: Website) => void;
}

export function Rankings({ websites, onVisit }: RankingsProps) {
  const [activeTab, setActiveTab] = useState<'visits' | 'likes'>('visits');

  // Sort websites by visits/likes
  const sortedWebsites = [...websites].sort((a, b) => {
    if (activeTab === 'visits') {
      return b.visits - a.visits;
    }
    return b.likes - a.likes;
  }).slice(0, 10); // Top 10

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-amber-400" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden",
      "bg-background/40 backdrop-blur-xl backdrop-saturate-150",
      "border-white/20 dark:border-white/10",
      "shadow-lg hover:shadow-xl",
      "transition-all duration-300"
    )}>
      {/* Header */}
      <div className="p-3 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">网站排行榜</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-1.5 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'visits' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('visits')}
            className={cn(
              "flex-1 transition-all duration-300 h-8",
              activeTab === 'visits' && "bg-primary text-primary-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            访问榜
          </Button>
          <Button
            variant={activeTab === 'likes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('likes')}
            className={cn(
              "flex-1 transition-all duration-300 h-8",
              activeTab === 'likes' && "bg-primary text-primary-foreground"
            )}
          >
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            点赞榜
          </Button>
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-border/50 relative">
        <AnimatePresence mode="popLayout">
          {sortedWebsites.map((website, index) => (
            <motion.div
              key={`${website.id}-${activeTab}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 500,
                damping: 40
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={cn(
                "relative p-3 flex items-center gap-3 group cursor-pointer",
                "hover:bg-gradient-to-r hover:from-primary/5 hover:via-primary/10 hover:to-transparent",
                "transition-all duration-300"
              )}
              onClick={() => onVisit(website)}
            >
              {/* Rank */}
              <motion.div 
                className="w-8 h-8 flex items-center justify-center shrink-0 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  {getRankIcon(index)}
                </div>
              </motion.div>

              {/* Website Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5 mb-1 group-hover:text-muted-foreground/80 transition-colors">
                  {website.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <motion.span
                      key={website.visits}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {website.visits}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    <motion.span
                      key={website.likes}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {website.likes}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Visit Arrow */}
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}