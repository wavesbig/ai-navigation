"use client";

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebsiteThumbnailProps {
  url: string;
  thumbnail?: string;
  title: string;
  className?: string;
}

export function WebsiteThumbnail({ url, thumbnail, title, className }: WebsiteThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const hostname = new URL(url).hostname;
  const faviconUrl = `https://icon.horse/icon/${hostname}`;

  if (!thumbnail || imageError) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center",
        "group-hover:bg-primary/10 transition-colors duration-300",
        className
      )}>
        <img 
          src={faviconUrl}
          alt={title}
          className="w-5 h-5"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <Globe className="h-5 w-5 text-primary/50 hidden" />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-10 h-10 rounded-lg overflow-hidden",
      "group-hover:ring-2 ring-primary/20 transition-all duration-300",
      className
    )}>
      <img 
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}