"use client";

import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { selectedCategoryAtom } from '@/lib/atoms';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { Category } from '@/lib/db';
import { useRef, useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: Category[];
}

const buttonVariants = {
  active: {
    scale: 1,
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  inactive: {
    scale: 1,
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  }
};

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : '全部';

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId !== null) {
      const index = categories.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        centerCategory(index);
      }
    } else {
      setVisibleRange({ start: 0, end: 5 });
    }
  };

  const centerCategory = (index: number) => {
    const visibleCount = 5;
    const halfVisible = Math.floor(visibleCount / 2);
    let start = Math.max(0, index - halfVisible);
    let end = Math.min(categories.length, start + visibleCount);
    
    if (end === categories.length) {
      start = Math.max(0, end - visibleCount);
    }
    
    setVisibleRange({ start, end });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const step = 1;
    if (direction === 'left') {
      setVisibleRange(prev => ({
        start: Math.max(0, prev.start - step),
        end: Math.max(5, prev.end - step)
      }));
    } else {
      setVisibleRange(prev => ({
        start: Math.min(categories.length - 5, prev.start + step),
        end: Math.min(categories.length, prev.end + step)
      }));
    }
  };

  const visibleCategories = [
    { id: null, name: '全部' },
    ...categories.slice(visibleRange.start, visibleRange.end)
  ];

  const canScrollLeft = visibleRange.start > 0;
  const canScrollRight = visibleRange.end < categories.length;

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mobile: Dropdown Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedCategoryName}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]">
            <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
              全部
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: Horizontal Categories with Arrows */}
      <div className="hidden md:flex items-center justify-center gap-2">
        <AnimatePresence initial={false}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm shrink-0"
              onClick={() => canScrollLeft && handleScroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div
              ref={containerRef}
              className="flex items-center gap-2 overflow-hidden px-2"
            >
              {visibleCategories.map((category) => (
                <motion.div
                  key={category.id ?? 'all'}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    variants={buttonVariants}
                    animate={selectedCategory === category.id ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => handleCategorySelect(category.id)}
                      className="h-8 px-4 text-sm whitespace-nowrap"
                    >
                      {category.name}
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm shrink-0"
              onClick={() => canScrollRight && handleScroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}