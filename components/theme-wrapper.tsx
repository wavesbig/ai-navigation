"use client";

import { useTheme } from '@/lib/theme';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useTheme();
  return <>{children}</>;
}