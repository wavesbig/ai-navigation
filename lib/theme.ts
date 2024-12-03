"use client";

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeSettingsAtom } from './atoms';

// 将颜色值转换为 HSL 格式
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // 移除 # 号
  hex = hex.replace('#', '');

  // 将十六进制转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// 应用主题设置
export function useTheme() {
  const [settings] = useAtom(themeSettingsAtom);

  useEffect(() => {
    const root = document.documentElement;
    
    // 转换主色调为 HSL
    const primary = hexToHSL(settings.primaryColor);
    root.style.setProperty('--primary', `${primary.h} ${primary.s}% ${primary.l}%`);
    
    // 转换次要色调为 HSL
    const secondary = hexToHSL(settings.secondaryColor);
    root.style.setProperty('--secondary', `${secondary.h} ${secondary.s}% ${secondary.l}%`);
    
    // 设置卡片圆角
    root.style.setProperty('--radius', settings.cardRadius);
    
    // 应用自定义 CSS
    let styleTag = document.getElementById('custom-css');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-css';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = settings.customCss;
    
  }, [settings]);
}