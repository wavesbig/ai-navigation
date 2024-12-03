"use client";

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { websitesAtom, categoriesAtom, isAdminModeAtom } from '@/lib/atoms';
import { getWebsites, getCategories } from '@/lib/db';
import { WebsiteList } from '@/components/admin/website-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Website } from '@/lib/types';

export default function AdminPage() {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [activeStatus, setActiveStatus] = useState<Website['status']>('pending');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }

    const loadData = () => {
      const websiteData = getWebsites();
      const categoryData = getCategories();
      setWebsites(websiteData);
      setCategories(categoryData);
    };

    loadData();
  }, [isAdmin, router, setWebsites, setCategories]);

  if (!isAdmin) return null;

  const filteredWebsites = websites.filter(website => {
    const matchesStatus = website.status === activeStatus;
    const matchesCategory = selectedCategory === 'all' || website.category_id === parseInt(selectedCategory);
    return matchesStatus && matchesCategory;
  });

  const statusCounts = {
    pending: websites.filter(w => w.status === 'pending').length,
    approved: websites.filter(w => w.status === 'approved').length,
    rejected: websites.filter(w => w.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">网站管理</h1>
        <p className="text-muted-foreground">管理所有提交的网站</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveStatus('pending')}
            className={`flex items-center gap-2 hover:bg-muted ${
              activeStatus === 'pending' ? 'bg-muted border-primary/50' : ''
            }`}
          >
            <span className="text-foreground">待审核</span>
            <Badge variant="secondary" className="bg-background/80">
              {statusCounts.pending}
            </Badge>
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveStatus('approved')}
            className={`flex items-center gap-2 hover:bg-muted ${
              activeStatus === 'approved' ? 'bg-muted border-primary/50' : ''
            }`}
          >
            <span className="text-foreground">已通过</span>
            <Badge variant="secondary" className="bg-background/80">
              {statusCounts.approved}
            </Badge>
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveStatus('rejected')}
            className={`flex items-center gap-2 hover:bg-muted ${
              activeStatus === 'rejected' ? 'bg-muted border-primary/50' : ''
            }`}
          >
            <span className="text-foreground">已拒绝</span>
            <Badge variant="secondary" className="bg-background/80">
              {statusCounts.rejected}
            </Badge>
          </Button>
        </div>

        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        key={activeStatus}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <WebsiteList
          websites={filteredWebsites}
          categories={categories}
          showActions={true}
        />
      </motion.div>
    </div>
  );
}