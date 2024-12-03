"use client";

import { motion } from 'framer-motion';
import { SearchBox } from '@/components/search-box';
import CategoryFilter from '@/components/category-filter';
import { headerVariants } from '@/lib/animations';
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
  return (
    <motion.div
      variants={headerVariants}
      animate={isScrolled ? "scrolled" : "top"}
      className={`
        sticky top-14 z-30 w-full
        transition-all duration-300
        ${isScrolled ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm' : ''}
      `}
    >
      <div className="w-full px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.div 
            layout
            className={`
              relative
              ${isScrolled ? 'glass-effect rounded-lg shadow-sm' : ''}
            `}
          >
            <SearchBox
              value={searchQuery}
              onChange={onSearchChange}
            />
          </motion.div>
          <motion.div 
            layout
            className={`
              relative
              ${isScrolled ? 'glass-effect rounded-lg p-2 shadow-sm' : ''}
            `}
          >
            <CategoryFilter categories={categories} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}