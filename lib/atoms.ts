import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Website, Category } from './types';

// 使用 atomWithStorage 来持久化存储设置
export const websitesAtom = atom<Website[]>([]);
export const categoriesAtom = atom<Category[]>([]);
export const searchQueryAtom = atom('');
export const selectedCategoryAtom = atom<number | null>(null);
export const isAdminModeAtom = atomWithStorage('isAdminMode', false);
export const isCompactModeAtom = atomWithStorage('isCompactMode', false);

// 网站基本设置
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  contactEmail: string;
}

export const generalSettingsAtom = atomWithStorage<GeneralSettings>('generalSettings', {
  siteName: '网站导航',
  siteDescription: '精选优质网站导航',
  siteKeywords: '导航,网站导航,优质网站',
  contactEmail: 'admin@example.com',
});

// 卡片样式类型
export type CardStyle = 'default' | 'minimal' | 'gradient' | 'glass' | 'bordered';

// 主题设置
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  cardRadius: string;
  cardStyle: CardStyle;
  enableDarkMode: boolean;
  customCss: string;
}

export const themeSettingsAtom = atomWithStorage<ThemeSettings>('themeSettings', {
  primaryColor: '#000000',
  secondaryColor: '#666666',
  cardRadius: '0.5rem',
  cardStyle: 'default',
  enableDarkMode: true,
  customCss: '',
});

// OSS 设置
export interface OSSSettings {
  provider: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
}

export const ossSettingsAtom = atomWithStorage<OSSSettings>('ossSettings', {
  provider: 'aliyun',
  region: 'oss-cn-hangzhou',
  bucket: '',
  accessKeyId: '',
  accessKeySecret: '',
  endpoint: '',
});

// 页脚设置
export interface FooterSettings {
  copyright: string;
  icp: string;
  links: Array<{
    title: string;
    url: string;
  }>;
  customHtml: string;
}

export const footerSettingsAtom = atom<FooterSettings>({
  copyright: '© 2024 网站导航',
  icp: '京ICP备XXXXXXXX号',
  links: [],
  customHtml: '',
});