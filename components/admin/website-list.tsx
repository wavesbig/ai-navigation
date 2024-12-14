"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, ThumbsUp, ThumbsDown, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { websitesAtom } from '@/lib/atoms';
import { WebsiteThumbnail } from '@/components/website/website-thumbnail';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { Website, Category } from '@/lib/types';

interface WebsiteListProps {
  websites: Website[];
  categories: Category[];
  showActions?: boolean;
}

export function WebsiteList({ websites: initialWebsites, categories, showActions = false }: WebsiteListProps) {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [websites, setWebsites] = useState(initialWebsites);
  const [allWebsites, setAllWebsites] = useAtom(websitesAtom);

  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

  const handleStatusUpdate = async (id: number, status: Website['status']) => {
    const response = await fetch(`/api/websites/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setAllWebsites(prevWebsites =>
        prevWebsites.map(website =>
          website.id === id ? { ...website, status } : website
        )
      );

      setWebsites(prevWebsites =>
        prevWebsites.filter(website => website.id !== id)
      );

      toast({
        title: '状态已更新',
        description: status === 'approved' ? '网站已通过审核' : '网站已被拒绝',
      });
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/websites/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setAllWebsites(prevWebsites =>
        prevWebsites.filter(website => website.id !== id)
      );

      setWebsites(prevWebsites =>
        prevWebsites.filter(website => website.id !== id)
      );
      
      setDeleteId(null);
      
      toast({
        title: '删除成功',
        description: '网站已被删除',
      });
    }
  };

  const handleVisit = (url: string) => {
    window.open(url, '_blank');
  };

  const getStatusColor = (status: Website['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'approved': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return '';
    }
  };

  const getStatusText = (status: Website['status']) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      default: return '';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // 控制子元素动画的间隔时间
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0,
      y: 20 // 从下方20px的位置开始
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (websites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex items-center justify-center py-12 text-center"
      >
        <div className="max-w-[420px] text-muted-foreground">
          <p className="text-lg mb-2">暂无网站</p>
          <p className="text-sm">当前分类或状态下没有符合条件的网站</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="w-full m-3 space-y-2"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {websites.map((website, index) => (
            <motion.div
              key={website.id}
              variants={item}
              layout
              custom={index}
              className="group px-3 py-2 bg-card border hover:border-border hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  title={website.title}
                  className="w-12 h-12 rounded shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">
                      {website.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="shrink-0 text-xs px-1.5 py-0">
                        {categories.find(c => c.id === website.category_id)?.name || '未分类'}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={cn("shrink-0 text-xs px-1.5 py-0", getStatusColor(website.status))}
                      >
                        {getStatusText(website.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1 group-hover:text-muted-foreground/80">
                    {website.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{website.visits}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{website.likes}</span>
                    </div>
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVisit(website.url)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    {website.status !== 'approved' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(website.id, 'approved')}
                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100/50"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {website.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(website.id, 'rejected')}
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(website.id)}
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销，确定要删除这个网站吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}