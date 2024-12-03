"use client";

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { websitesAtom, categoriesAtom, searchQueryAtom, selectedCategoryAtom, isAdminModeAtom } from '@/lib/atoms';
import { getWebsites, getCategories } from '@/lib/db';
import WebsiteGrid from '@/components/website/website-grid';
import CategoryFilter from '@/components/category-filter';
import { SearchBox } from '@/components/search-box';
import { Brain, Cpu, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const [isAdmin] = useAtom(isAdminModeAtom);

  useEffect(() => {
    const loadData = async () => {
      const websiteData = getWebsites(isAdmin ? undefined : 'approved');
      const categoryData = getCategories();
      
      setWebsites(websiteData);
      setCategories(categoryData);
    };

    loadData();
  }, [isAdmin, setWebsites, setCategories]);

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         website.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || website.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 主要内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative space-y-2"
      >
        {/* Hero 区域 */}
        <div className="relative py-8">
          <motion.div 
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <Brain className="w-12 h-12 text-primary/20" />
            </div>
            <div className="absolute right-1/4 top-1/3 transform translate-x-1/2 -translate-y-1/2">
              <Cpu className="w-10 h-10 text-primary/15" />
            </div>
            <div className="absolute left-1/3 bottom-1/4 transform -translate-x-1/2 translate-y-1/2">
              <Sparkles className="w-8 h-8 text-primary/10" />
            </div>
            <div className="absolute right-1/3 bottom-1/3 transform translate-x-1/2 translate-y-1/2">
              <Zap className="w-9 h-9 text-primary/10" />
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  探索AI新世界
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                发现、分享和收藏优质AI工具与资源。
              </p>
            </motion.div>

            {/* 搜索和分类区域 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto space-y-3"
            >
              {/* 搜索框 */}
              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
              />

              {/* 分类过滤器 */}
              <CategoryFilter categories={categories} />
            </motion.div>
          </div>
        </div>

        {/* 网站列表 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory || 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            <WebsiteGrid websites={filteredWebsites} categories={categories} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}