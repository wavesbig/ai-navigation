"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ThumbsUp, ThumbsDown, Globe } from 'lucide-react';
import { themeSettingsAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';
import type { Website, Category } from '@/lib/types';

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website['status']) => void;
}

const cardStyles = {
  default: "",
  minimal: "bg-transparent border-none shadow-none hover:bg-muted/50",
  gradient: "bg-gradient-to-br from-primary/5 to-primary/10 border-none",
  glass: "backdrop-blur-md bg-background/60 border-none",
  bordered: "border-2 hover:border-primary/50 shadow-none",
};

export function WebsiteCard({ website, category, isAdmin, onVisit, onStatusUpdate }: WebsiteCardProps) {
  const themeSettings = useAtomValue(themeSettingsAtom);

  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  };

  const statusText = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  };

  return (
    <Card className={cn(
      "group relative h-full flex flex-col overflow-hidden transition-all duration-300",
      "hover:shadow-lg hover:-translate-y-1",
      cardStyles[themeSettings.cardStyle]
    )}>
      {/* 网站图标和状态 */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-full bg-background/95 backdrop-blur flex items-center justify-center shadow-sm border">
          <Globe className="w-4 h-4 text-primary" />
        </div>
        <Badge 
          className={cn(
            "text-[10px] px-2 py-0.5 h-5",
            statusColors[website.status]
          )}
        >
          {statusText[website.status]}
        </Badge>
      </div>

      {/* 主要内容 */}
      <div className="flex-grow p-4 pt-14">
        <div className="space-y-2">
          <CardTitle className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {website.title}
          </CardTitle>
          <CardDescription className="text-xs line-clamp-2 h-8">
            {website.description}
          </CardDescription>
        </div>
      </div>

      {/* 底部信息和操作 */}
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <Badge 
            variant="outline" 
            className="text-[10px] px-2 py-0.5 h-5 group-hover:bg-primary/10 transition-colors"
          >
            {category?.name || '未分类'}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {website.visits} 次访问
          </span>
        </div>

        <div className="flex gap-1.5 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-xs group-hover:border-primary/50 transition-colors"
            onClick={() => onVisit(website)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            访问
          </Button>
          
          {isAdmin && website.status !== 'approved' && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onStatusUpdate(website.id, 'approved')}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              通过
            </Button>
          )}
          
          {isAdmin && website.status !== 'rejected' && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onStatusUpdate(website.id, 'rejected')}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              拒绝
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}