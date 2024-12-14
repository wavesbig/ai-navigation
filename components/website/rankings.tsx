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
        return <Crown className="h-5 w-5 text-amber-400" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">网站排行榜</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b bg-muted/30">
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'visits' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('visits')}
            className={cn(
              "flex-1 transition-all duration-300",
              activeTab === 'visits' && "bg-primary text-primary-foreground"
            )}
          >
            <Eye className="h-4 w-4 mr-2" />
            访问榜
          </Button>
          <Button
            variant={activeTab === 'likes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('likes')}
            className={cn(
              "flex-1 transition-all duration-300",
              activeTab === 'likes' && "bg-primary text-primary-foreground"
            )}
          >
            <Heart className="h-4 w-4 mr-2" />
            点赞榜
          </Button>
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-border/50">
        <AnimatePresence mode="popLayout">
          {sortedWebsites.map((website, index) => (
            <motion.div
              key={`${website.id}-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.2, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className={cn(
                "relative p-3 flex items-center gap-3 group",
                "hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent",
                "transition-all duration-300"
              )}
            >
              {/* Rank */}
              <div className="w-10 flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              {/* Website Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "shrink-0 transition-colors",
                      activeTab === 'visits' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}
                  >
                    {activeTab === 'visits' ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <Heart className="h-3 w-3 mr-1" />
                    )}
                    {activeTab === 'visits' ? website.visits : website.likes}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {website.description}
                </p>
              </div>

              {/* Visit Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVisit(website)}
                className={cn(
                  "h-8 w-8 shrink-0",
                  "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                  "transition-all duration-300"
                )}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}