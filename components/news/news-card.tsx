"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';
import type { NewsItem } from '@/lib/types';

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const handleVisit = () => {
    window.open(news.sourceUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300">
      {news.thumbnail && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="flex-grow space-y-2">
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDate(news.publishDate)}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {news.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {news.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            来源: {news.source}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-primary"
            onClick={handleVisit}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            阅读全文
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}