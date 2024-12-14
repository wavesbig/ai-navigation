"use client";

import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  websitesAtom, 
  categoriesAtom, 
  searchQueryAtom, 
  selectedCategoryAtom 
} from '@/lib/atoms';
import WebsiteGrid from '@/components/website/website-grid';
import { PersistentHeader } from '@/components/persistent-header';
import { Typewriter } from '@/components/typewriter';
import { Brain, Cpu, Sparkles, Zap } from 'lucide-react';
import {
  heroContainerVariants,
  heroTitleVariants,
  heroDescriptionVariants,
  backgroundPatternVariants,
  floatingIconVariants,
  gridContainerVariants,
} from '@/lib/animations';
import type { Website } from '@/lib/types';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CategoryResponse {
  code: number;
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  }>;
  message: string;
}

export default function Home() {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { theme } = useTheme();

  // Enhanced scroll-based animations
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -100]);
  const isScrolled = useTransform(scrollY, (value) => value > 300);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [websiteResponse, categoryResponse] = await Promise.all([
          fetch('/api/websites'),
          fetch('/api/categories')
        ]);
        
        if (!websiteResponse.ok || !categoryResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const websiteData = await websiteResponse.json();
        const categoryData: CategoryResponse = await categoryResponse.json();
        
        if (categoryData.success && Array.isArray(categoryData.data)) {
          // 确保类别数据是唯一的（通过 id 去重）
          const uniqueCategories = categoryData.data.reduce((acc, current) => {
            const exists = acc.find(item => item.id === current.id);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, [] as CategoryResponse['data']);

          setCategories(uniqueCategories);
        }

        if (websiteData.success && Array.isArray(websiteData.data)) {
          setWebsites(websiteData.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!websites) return;

    const filtered = websites.filter(website => {
      if (!website || website.status !== 'approved') return false;
      
      const matchesSearch = !searchQuery || 
        website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || website.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredWebsites(filtered);
  }, [websites, searchQuery, selectedCategory]);

  useEffect(() => {
    if (theme === 'dark') {
      console.log('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleVisit = (website: Website) => {
    fetch(`/api/websites/${website.id}/visit`, { method: 'POST' });
    window.open(website.url, '_blank');
  };

  return (
    <div className="relative min-h-screen" ref={contentRef}>
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={false}
        animate={{ opacity: 1 }}
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <motion.div
          initial={false}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>

      {/* Persistent Header */}
      <PersistentHeader
        searchQuery={searchQuery}
        onSearchChange={(searchQuery) => console.log(searchQuery)}
        categories={categories}
        isScrolled={isScrolled.get()}
      />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Hero Section */}
        <motion.div 
          className="relative py-16"
          style={{ 
            opacity: heroOpacity, 
            scale: heroScale,
            y: heroTranslateY 
          }}
        >
          {/* Floating Icons */}
          <AnimatePresence mode="wait">
            {[
              { Icon: Brain, position: "left-1/4 top-1/4", size: "w-12 h-12" },
              { Icon: Cpu, position: "right-1/4 top-1/3", size: "w-10 h-10" },
              { Icon: Sparkles, position: "left-1/3 bottom-1/4", size: "w-8 h-8" },
              { Icon: Zap, position: "right-1/3 bottom-1/3", size: "w-9 h-9" }
            ].map(({ Icon, position, size }, index) => (
              <motion.div
                key={index}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`}
                initial={false}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.2,
                    duration: 0.8
                  }
                }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 10,
                  transition: { duration: 0.3 }
                }}
              >
                <Icon className={`${size} text-primary/20`} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Title */}
            <motion.div className="space-y-4">
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  探索AI新世界
                </span>
              </motion.h1>
              <motion.div
                initial={false} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typewriter 
                  text="发现、分享和收藏优质AI工具与资源，让你的人工智能生活更美好"
                  speed={10}
                  delay={1000}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Website Grid */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="container mx-auto px-4 pb-24"
        >
          <WebsiteGrid 
            websites={filteredWebsites} 
            categories={categories} 
            onVisit={handleVisit}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}