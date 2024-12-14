"use client";

import { Button } from '@/components/ui/button';

interface FooterLinkProps {
  title: string;
  url: string;
}

export function FooterLink({ title, url }: FooterLinkProps) {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {title}
    </a>
  );
}