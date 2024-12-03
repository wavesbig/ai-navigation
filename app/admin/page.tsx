"use client";

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { websitesAtom, categoriesAtom, isAdminModeAtom } from '@/lib/atoms';
import { getWebsites, getCategories } from '@/lib/db';
import { WebsiteList } from '@/components/admin/website-list';
import type { Website } from '@/lib/types';

export default function AdminPage() {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [activeTab, setActiveTab] = useState<Website['status']>('pending');
  const router = useRouter();

  useEffect(() => {
    // 如果不是管理员模式，重定向到首页
    if (!isAdmin) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      const websiteData = getWebsites();
      const categoryData = getCategories();
      
      setWebsites(websiteData);
      setCategories(categoryData);
    };

    loadData();
  }, [isAdmin, router, setWebsites, setCategories]);

  if (!isAdmin) return null;

  const filteredWebsites = {
    pending: websites.filter(w => w.status === 'pending'),
    approved: websites.filter(w => w.status === 'approved'),
    rejected: websites.filter(w => w.status === 'rejected'),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold mb-2">网站管理</h1>
        <p className="text-muted-foreground">管理所有提交的网站</p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as Website['status'])}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="pending" className="flex-1 md:flex-none">
            待审核 ({filteredWebsites.pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1 md:flex-none">
            已通过 ({filteredWebsites.approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1 md:flex-none">
            已拒绝 ({filteredWebsites.rejected.length})
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value={activeTab} forceMount>
              <WebsiteList
                websites={filteredWebsites[activeTab]}
                categories={categories}
                showActions={true}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}