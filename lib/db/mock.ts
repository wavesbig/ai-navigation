// 模拟数据库操作
// 在客户端使用 localStorage 模拟数据库功能

import type { Website, Category } from '../types';
import type { GeneralSettings, ThemeSettings, OSSSettings, FooterSettings } from '../atoms';

const STORAGE_KEY = 'weblinks-db';

interface StorageData {
  websites: Website[];
  categories: Category[];
  settings: {
    general?: GeneralSettings;
    theme?: ThemeSettings;
    oss?: OSSSettings;
    footer?: FooterSettings;
  };
}

// 初始化数据
const initialData: StorageData = {
  websites: [],
  categories: [
    { id: 1, name: '开发工具', slug: 'dev-tools', created_at: new Date().toISOString() },
    { id: 2, name: '设计资源', slug: 'design', created_at: new Date().toISOString() },
    { id: 3, name: '学习教程', slug: 'tutorials', created_at: new Date().toISOString() },
    { id: 4, name: '效率工具', slug: 'productivity', created_at: new Date().toISOString() },
    { id: 5, name: '资讯媒体', slug: 'news', created_at: new Date().toISOString() },
    { id: 6, name: '社区论坛', slug: 'community', created_at: new Date().toISOString() },
    { id: 7, name: '人工智能', slug: 'ai', created_at: new Date().toISOString() },
    { id: 8, name: '开源项目', slug: 'opensource', created_at: new Date().toISOString() },
  ],
  settings: {},
};

// 获取存储数据
function getStorageData(): StorageData {
  if (typeof window === 'undefined') return initialData;
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
}

// 保存数据
function setStorageData(data: StorageData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 网站管理
export function getWebsites(status?: Website['status']): Website[] {
  const data = getStorageData();
  return status 
    ? data.websites.filter(w => w.status === status)
    : data.websites;
}

export function addWebsite(website: Omit<Website, 'id' | 'visits' | 'created_at'>): Website {
  const data = getStorageData();
  const newWebsite: Website = {
    ...website,
    id: Date.now(),
    visits: 0,
    created_at: new Date().toISOString(),
  };
  
  data.websites.push(newWebsite);
  setStorageData(data);
  return newWebsite;
}

export function updateWebsiteStatus(id: number, status: Website['status']) {
  const data = getStorageData();
  const website = data.websites.find(w => w.id === id);
  if (website) {
    website.status = status;
    setStorageData(data);
  }
}

export function deleteWebsite(id: number) {
  const data = getStorageData();
  data.websites = data.websites.filter(w => w.id !== id);
  setStorageData(data);
}

export function incrementVisits(id: number) {
  const data = getStorageData();
  const website = data.websites.find(w => w.id === id);
  if (website) {
    website.visits++;
    setStorageData(data);
  }
}

// 分类管理
export function getCategories(): Category[] {
  const data = getStorageData();
  return data.categories;
}

// 设置管理
export function getSetting<T>(key: string): T | null {
  const data = getStorageData();
  return (data.settings[key as keyof StorageData['settings']] as T) || null;
}

export function updateSetting<T>(key: string, value: T) {
  const data = getStorageData();
  data.settings[key as keyof StorageData['settings']] = value;
  setStorageData(data);
}

// 导出所有数据库操作函数
export {
  getWebsites as default,
  addWebsite,
  updateWebsiteStatus,
  deleteWebsite,
  incrementVisits,
  getCategories,
  getSetting,
  updateSetting,
};