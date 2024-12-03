"use client";

import { Button } from '@/components/ui/button';

interface FooterLinkProps {
  name: string;
  url: string;
  isAdmin?: boolean;
  onRemove?: () => void;
}

export function FooterLink({ name, url, isAdmin, onRemove }: FooterLinkProps) {
  return (
    <div className="flex items-center gap-2 group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-0.5"
      >
        {name}
      </a>
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          ×
        </Button>
      )}
    </div>
  );
}