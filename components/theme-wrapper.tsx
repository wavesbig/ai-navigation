"use client";

import { useThemeEffect } from "@/hooks/use-theme-effect";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useThemeEffect();
  return <>{children}</>;
}