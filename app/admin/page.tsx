"use client";

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { websitesAtom, categoriesAtom, isAdminModeAtom } from '@/lib/atoms';
import { WebsiteList } from '@/components/admin/website-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Website } from '@/lib/types';
import { Settings } from "lucide-react";
import Link from "next/link";

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

    const loadData = async () => {
      try {
        const [websiteRes, categoryRes] = await Promise.all([
          fetch('/api/websites?status=all'),
          fetch('/api/categories')
        ]);

        const websiteData = await websiteRes.json();
        const categoryData = await categoryRes.json();

        if (websiteData.success && Array.isArray(websiteData.data)) {
          setWebsites(websiteData.data);
        }

        if (categoryData.success && Array.isArray(categoryData.data)) {
          setCategories(categoryData.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [isAdmin, router, setWebsites, setCategories]);

  if (!isAdmin) return null;
  if (!websites || !Array.isArray(websites)) return null;
  if (!categories || !Array.isArray(categories)) return null;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="container max-w-6xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-1">后台管理</h1>
            <p className="text-sm text-muted-foreground">管理网站内容和系统设置</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground"
            data-active="true"
          >
            网站管理
          </Button>
          <Link href="/admin/settings">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground"
            >
              网站设置
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="bg-card rounded-lg border overflow-hidden pb-20">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b bg-muted/50"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-2">
            {['pending', 'approved', 'rejected'].map((status) => (
              <motion.div
                key={status}
                variants={itemVariants}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStatus(status as Website['status'])}
                  className={`flex items-center gap-2 hover:bg-muted ${
                    activeStatus === status ? 'bg-muted border-primary/50' : ''
                  }`}
                >
                  <span className="text-foreground">
                    {status === 'pending' ? '待审核' : status === 'approved' ? '已通过' : '已拒绝'}
                  </span>
                  <Badge variant="secondary" className="bg-background/80">
                    {statusCounts[status as keyof typeof statusCounts]}
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem key="all" value="all">全部分类</SelectItem>
                {categories.map(category => (
                  <SelectItem key={`category-${category.id}`} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <WebsiteList
            key={`${activeStatus}-${selectedCategory}`}
            websites={filteredWebsites}
            categories={categories}
            showActions={true}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}