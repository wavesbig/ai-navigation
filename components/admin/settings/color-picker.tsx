"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: color }}
          />
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-32"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {[
              '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
              '#FF00FF', '#00FFFF', '#808080', '#800000', '#808000',
              '#008000', '#800080', '#008080', '#000080', '#FFFFFF',
            ].map((presetColor) => (
              <div
                key={presetColor}
                className="w-8 h-8 rounded-md cursor-pointer border hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}