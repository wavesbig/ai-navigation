import { atom } from 'jotai';
import type { Website, Category } from './types';

// 网站数据
export const websitesAtom = atom<Website[]>([]);
export const categoriesAtom = atom<Category[]>([]);

// 搜索和过滤
export const searchQueryAtom = atom('');
export const selectedCategoryAtom = atom<string | null>(null);
export const isCompactModeAtom = atom(false);

// 主题设置
export const themeSettingsAtom = atom({
  theme: 'system' as 'light' | 'dark' | 'system',
  accentColor: 'blue' as string,
});

// 管理员模式
export const isAdminModeAtom = atom(false);

// 网站设置
export const generalSettingsAtom = atom({
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  contactEmail: '',
});

// 页脚设置
export const footerSettingsAtom = atom({
  copyright: '',
  icpBeian: '',
  links: [] as { name: string; url: string }[],
  customHtml: '',
});
