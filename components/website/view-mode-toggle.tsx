"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface ViewModeToggleProps {
  isCompact: boolean;
  onChange: (isCompact: boolean) => void;
}

export function ViewModeToggle({ isCompact, onChange }: ViewModeToggleProps) {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
    >
      <div className="bg-background/80 backdrop-blur-xl border rounded-full p-1 shadow-lg">
        <Button
          variant={isCompact ? "ghost" : "secondary"}
          size="sm"
          onClick={() => onChange(false)}
          className="h-9 w-9 p-0 rounded-full"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={isCompact ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onChange(true)}
          className="h-9 w-9 p-0 rounded-full"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}