"use client";

import { motion } from 'framer-motion';
import { SearchBox } from '@/components/search-box';
import { CategoryFilter } from '@/components/category-filter';
import { stickyHeaderVariants } from '@/lib/animations';
import type { Category } from '@/lib/types';

interface StickyHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
}

export function StickyHeader({ searchQuery, onSearchChange, categories }: StickyHeaderProps) {
  return (
    <motion.div
      variants={stickyHeaderVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-[3.5rem] left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b"
    >
      <div className="w-full px-4 py-4 space-y-4">
        <div className="max-w-screen-2xl mx-auto">
          <SearchBox
            value={searchQuery}
            onChange={onSearchChange}
            className="shadow-lg"
          />
          <div className="mt-4">
            <CategoryFilter categories={categories} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}