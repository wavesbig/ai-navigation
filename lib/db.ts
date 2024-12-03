// Mock database using localStorage
const STORAGE_KEY = 'weblinks-db';

interface StorageData {
  websites: Website[];
  categories: Category[];
}

export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
  visits: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

// Initialize with sample data in Chinese
const initialData: StorageData = {
  categories: [
    { id: 1, name: '开发工具', slug: 'dev-tools', created_at: new Date().toISOString() },
    { id: 2, name: '设计资源', slug: 'design', created_at: new Date().toISOString() },
    { id: 3, name: '学习教程', slug: 'tutorials', created_at: new Date().toISOString() },
    { id: 4, name: '效率工具', slug: 'productivity', created_at: new Date().toISOString() },
    { id: 5, name: '资讯媒体', slug: 'news', created_at: new Date().toISOString() },
    { id: 6, name: '社区论坛', slug: 'community', created_at: new Date().toISOString() },
    { id: 7, name: '人工智能', slug: 'ai', created_at: new Date().toISOString() },
    { id: 8, name: '开源项目', slug: 'opensource', created_at: new Date().toISOString() }
  ],
  websites: [],
};

// Helper function to initialize localStorage with sample data
function initializeStorage() {
  if (typeof window === 'undefined') return;
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
}

function getStorageData(): StorageData {
  if (typeof window === 'undefined') return initialData;
  
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
}

function setStorageData(data: StorageData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const getWebsites = (status?: Website['status']) => {
  const data = getStorageData();
  return status 
    ? data.websites.filter(w => w.status === status)
    : data.websites;
};

export const getWebsitesByCategory = (categoryId: number, status?: Website['status']) => {
  const data = getStorageData();
  return data.websites.filter(w => {
    const matchesCategory = w.category_id === categoryId;
    return status ? matchesCategory && w.status === status : matchesCategory;
  });
};

export const getCategories = () => {
  const data = getStorageData();
  return data.categories;
};

export const addWebsite = (website: Omit<Website, 'id' | 'visits' | 'created_at'>) => {
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
};

export const updateWebsiteStatus = (id: number, status: Website['status']) => {
  const data = getStorageData();
  const website = data.websites.find(w => w.id === id);
  if (website) {
    website.status = status;
    setStorageData(data);
  }
};

export const deleteWebsite = (id: number) => {
  const data = getStorageData();
  data.websites = data.websites.filter(w => w.id !== id);
  setStorageData(data);
};

export const incrementVisits = (id: number) => {
  const data = getStorageData();
  const website = data.websites.find(w => w.id === id);
  if (website) {
    website.visits++;
    setStorageData(data);
  }
};