"use client";

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { motion, useScroll, useTransform } from 'framer-motion';
import { websitesAtom, categoriesAtom, searchQueryAtom, selectedCategoryAtom } from '@/lib/atoms';
import { getWebsites, getCategories, incrementVisits } from '@/lib/db';
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

export default function Home() {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Enhanced scroll-based animations
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -100]);
  const isScrolled = useTransform(scrollY, (value) => value > 300);

  useEffect(() => {
    const loadData = () => {
      try {
        const websiteData = getWebsites('approved');
        const categoryData = getCategories();
        setWebsites(websiteData || []);
        setCategories(categoryData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setWebsites([]);
        setCategories([]);
      }
    };

    loadData();
  }, [setWebsites, setCategories]);

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = !searchQuery || 
      website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || website.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVisit = (website: Website) => {
    incrementVisits(website.id);
    window.open(website.url, '_blank');
  };

  return (
    <div className="relative min-h-screen" ref={contentRef}>
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <motion.div
          variants={backgroundPatternVariants}
          initial="hidden"
          animate="visible"
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
        onSearchChange={setSearchQuery}
        categories={categories}
        isScrolled={isScrolled.get()}
      />

      {/* Main Content */}
      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
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
          <div className="absolute inset-0 -z-10">
            {[
              { Icon: Brain, position: "left-1/4 top-1/4", size: "w-12 h-12", delay: 0 },
              { Icon: Cpu, position: "right-1/4 top-1/3", size: "w-10 h-10", delay: 1 },
              { Icon: Sparkles, position: "left-1/3 bottom-1/4", size: "w-8 h-8", delay: 2 },
              { Icon: Zap, position: "right-1/3 bottom-1/3", size: "w-9 h-9", delay: 3 }
            ].map(({ Icon, position, size, delay }, index) => (
              <motion.div
                key={index}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`}
                variants={floatingIconVariants}
                custom={delay}
                initial="hidden"
                animate="visible"
              >
                <Icon className={`${size} text-primary/20`} />
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Title */}
            <motion.div className="space-y-4">
              <motion.h1
                variants={heroTitleVariants}
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  探索AI新世界
                </span>
              </motion.h1>
              <motion.div
                variants={heroDescriptionVariants}
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
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
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