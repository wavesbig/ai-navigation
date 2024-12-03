"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ThumbsUp, ThumbsDown, Trash2, ExternalLink } from 'lucide-react';
import { updateWebsiteStatus, deleteWebsite } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { websitesAtom } from '@/lib/atoms';
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
    // 更新全局状态
    setAllWebsites(prevWebsites =>
      prevWebsites.map(website =>
        website.id === id ? { ...website, status } : website
      )
    );

    // 更新本地状态，触发动画
    setWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );

    // 更新数据库
    updateWebsiteStatus(id, status);

    toast({
      title: '状态已更新',
      description: status === 'approved' ? '网站已通过审核' : '网站已被拒绝',
    });
  };

  const handleDelete = (id: number) => {
    // 更新全局状态
    setAllWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );

    // 更新本地状态，触发动画
    setWebsites(prevWebsites =>
      prevWebsites.filter(website => website.id !== id)
    );
    
    // 更新数据库
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

  if (websites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">暂无网站</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {websites.map((website) => (
            <motion.div
              key={website.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{
                opacity: { duration: 0.2 },
                layout: { duration: 0.3 }
              }}
            >
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl line-clamp-1">{website.title}</CardTitle>
                    <Badge 
                      variant={
                        website.status === 'approved' ? 'default' :
                        website.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {
                        website.status === 'approved' ? '已通过' :
                        website.status === 'rejected' ? '已拒绝' : '待审核'
                      }
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {website.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {categories.find(c => c.id === website.category_id)?.name || '未分类'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      访问量: {website.visits}
                    </span>
                  </div>

                  {showActions && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVisit(website.url)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        访问
                      </Button>
                      
                      {website.status !== 'approved' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusUpdate(website.id, 'approved')}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          通过
                        </Button>
                      )}
                      
                      {website.status !== 'rejected' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusUpdate(website.id, 'rejected')}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          拒绝
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeleteId(website.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
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