import { z } from 'zod';

// 数据库表结构定义
export const settingsSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string(),
  updated_at: z.string(),
});

export const websiteSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  category_id: z.number(),
  thumbnail: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
  visits: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// 数据库迁移 SQL
export const migrations = [
  // 初始化数据库
  `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    thumbnail TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    visits INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
  CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
  CREATE INDEX IF NOT EXISTS idx_websites_category ON websites(category_id);
  CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  `,
];

// 初始数据
export const seedData = {
  categories: [
    { name: '开发工具', slug: 'dev-tools' },
    { name: '设计资源', slug: 'design' },
    { name: '学习教程', slug: 'tutorials' },
    { name: '效率工具', slug: 'productivity' },
    { name: '资讯媒体', slug: 'news' },
    { name: '社区论坛', slug: 'community' },
    { name: '人工智能', slug: 'ai' },
    { name: '开源项目', slug: 'opensource' },
  ],
  settings: [
    { key: 'siteName', value: '网站导航' },
    { key: 'siteDescription', value: '精选优质网站导航' },
    { key: 'siteKeywords', value: '导航,网站导航,优质网站' },
    { key: 'contactEmail', value: 'admin@example.com' },
  ],
};