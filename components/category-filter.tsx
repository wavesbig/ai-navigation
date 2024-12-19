"use client";

import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { selectedCategoryAtom } from '@/lib/store';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { Category } from '@/lib/types';
import { useRef, useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: Category[];
}

const buttonVariants = {
  active: {
    scale: 1.05,
    y: -1,
    backgroundColor: 'rgba(var(--background), 0.8)',
    color: 'hsl(var(--primary))',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  inactive: {
    scale: 1,
    y: 0,
    backgroundColor: 'transparent',
    color: 'hsl(var(--muted-foreground))',
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
    ? categories?.find(c => c.id === Number(selectedCategory))?.name || '未知分类'
    : '全部';

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId === null ? null : String(categoryId));
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
    const maxLength = categories?.length || 0;
    let start = Math.max(0, index - halfVisible);
    let end = Math.min(maxLength, start + visibleCount);
    
    if (end === maxLength) {
      start = Math.max(0, end - visibleCount);
    }
    
    setVisibleRange({ start, end });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const step = 1;
    const maxLength = categories?.length || 0;
    if (direction === 'left') {
      setVisibleRange(prev => ({
        start: Math.max(0, prev.start - step),
        end: Math.max(5, prev.end - step)
      }));
    } else {
      setVisibleRange(prev => ({
        start: Math.min(maxLength - 5, prev.start + step),
        end: Math.min(maxLength, prev.end + step)
      }));
    }
  };

  const visibleCategories = [
    { id: null, name: '全部' },
    ...(categories?.slice(visibleRange.start, visibleRange.end) || [])
  ];

  const canScrollLeft = visibleRange.start > 0;
  const canScrollRight = visibleRange.end < (categories?.length || 0);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mobile: Dropdown Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-background/40 backdrop-blur-sm border-border/30 hover:bg-background/60 hover:border-border/50"
            >
              <span className={selectedCategory === null ? "text-primary" : "text-foreground/70"}>
                {selectedCategoryName}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] min-w-[200px] bg-background/60 backdrop-blur-md border-border/30">
            <DropdownMenuItem 
              onClick={() => handleCategorySelect(null)}
              className={`${selectedCategory === null 
                ? 'text-primary bg-primary/5' 
                : 'text-foreground/70'} hover:text-foreground focus:text-foreground`}
            >
              全部
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`${selectedCategory?.toString() === category.id.toString()
                  ? 'text-primary bg-primary/5' 
                  : 'text-foreground/70'} hover:text-foreground focus:text-foreground`}
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
          <div className="relative flex items-center gap-2">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-background/60 rounded-xl backdrop-blur-sm" />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/40 disabled:opacity-20 transition-all z-10"
              onClick={() => canScrollLeft && handleScroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div
              ref={containerRef}
              className="relative flex items-center gap-2 overflow-hidden px-2 z-10"
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
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`h-8 px-4 text-sm whitespace-nowrap transition-all duration-300
                        ${selectedCategory === category.id 
                          ? 'bg-background/80 text-primary shadow-[0_2px_8px_-2px_rgba(var(--primary),0.3)] backdrop-blur-sm' 
                          : 'hover:bg-background/40 text-muted-foreground hover:text-foreground'
                        }`}
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
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/40 disabled:opacity-20 transition-all z-10"
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