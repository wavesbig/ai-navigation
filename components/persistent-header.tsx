"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { SearchBox } from '@/components/search-box';
import CategoryFilter from '@/components/category-filter';
import { headerVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface PersistentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  isScrolled: boolean;
}

export function PersistentHeader({ 
  searchQuery, 
  onSearchChange, 
  categories,
  isScrolled 
}: PersistentHeaderProps) {
  const [opacity, setOpacity] = useState(0);
  const maxScroll = 200; // 滚动200px达到最大效果

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 计算0-1之间的值
      const newOpacity = Math.min(scrollY / maxScroll, 1);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="sticky top-14 z-40 w-full transition-all duration-100"
      style={{
        background: `rgba(var(--background), ${opacity * 0.3})`,
        backdropFilter: `blur(${opacity * 16}px)`,
        WebkitBackdropFilter: `blur(${opacity * 16}px)`, // Safari 支持
        borderColor: `rgba(255, 255, 255, ${opacity * 0.2})`
      }}
    >
      <div className="w-full px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.div layout>
            <SearchBox
              value={searchQuery}
              onChange={onSearchChange}
            />
          </motion.div>
          <motion.div layout>
            <CategoryFilter categories={categories} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}