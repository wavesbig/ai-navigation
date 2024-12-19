"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // @ts-ignore
      if (!document.startViewTransition) return;

      const updateThemeWithTransition = () => {
        // @ts-ignore
        document.startViewTransition(() => {
          const root = document.documentElement;
          const isDark = root.classList.contains("dark");
          root.classList.toggle("dark", !isDark);
        });
      };

      window.addEventListener('theme-change', updateThemeWithTransition);
      
      return () => {
        window.removeEventListener('theme-change', updateThemeWithTransition);
      };
    } catch (e) {
      console.error('View Transitions API error:', e);
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}