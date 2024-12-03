"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, ThumbsUp, ThumbsDown, Trash2, ExternalLink } from 'lucide-react';
import { updateWebsiteStatus, deleteWebsite } from '@/lib/db';
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

  const handleStatusUpdate = (id: number, status: Website['status']) => {
    setAllWebsites(prevWebsites =>
      prevWebsites.map(website =>
        website.id === id ? { ...website, status } : website
      )
    );

    setWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );

    updateWebsiteStatus(id, status);

    toast({
      title: '状态已更新',
      description: status === 'approved' ? '网站已通过审核' : '网站已被拒绝',
    });
  };

  const handleDelete = (id: number) => {
    setAllWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );

    setWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );
    
    deleteWebsite(id);
    setDeleteId(null);
    
    toast({
      title: '删除成功',
      description: '网站已被删除',
    });
  };

  const handleVisit = (url: string) => {
    window.open(url, '_blank');
  };

  const getStatusColor = (status: Website['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  const getStatusText = (status: Website['status']) => {
    switch (status) {
      case 'pending':
        return '待审核';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return '';
    }
  };

  if (websites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">暂无网站</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {websites.map((website) => (
            <motion.div
              key={website.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="group bg-card hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  title={website.title}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{website.title}</h3>
                    <Badge variant="outline" className="shrink-0">
                      {categories.find(c => c.id === website.category_id)?.name || '未分类'}
                    </Badge>
                    <Badge variant="secondary" className={cn("shrink-0", getStatusColor(website.status))}>
                      {getStatusText(website.status)}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{website.visits}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{website.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {showActions && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisit(website.url)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    {website.status !== 'approved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(website.id, 'approved')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-100/50"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {website.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(website.id, 'rejected')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100/50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(website.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}