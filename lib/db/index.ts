import { Database } from 'better-sqlite3';
import { z } from 'zod';
import { migrations, seedData } from './schema';
import type { Website, Category } from '../types';
import type { GeneralSettings, ThemeSettings, OSSSettings, FooterSettings } from '../atoms';

// 数据库实例
let db: Database | null = null;

// 初始化数据库
export function initDatabase() {
  if (typeof window !== 'undefined') {
    console.warn('Database operations should only be performed on the server side');
    return;
  }

  if (!db) {
    db = new Database('data/weblinks.db');
    
    // 启用外键约束
    db.pragma('foreign_keys = ON');
    
    // 执行迁移
    migrations.forEach(migration => {
      db.exec(migration);
    });

    // 检查是否需要初始化数据
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    if (categoriesCount === 0) {
      const insertCategory = db.prepare(
        'INSERT INTO categories (name, slug) VALUES (@name, @slug)'
      );
      
      seedData.categories.forEach(category => {
        insertCategory.run(category);
      });
    }

    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
    if (settingsCount === 0) {
      const insertSetting = db.prepare(
        'INSERT INTO settings (key, value) VALUES (@key, @value)'
      );
      
      seedData.settings.forEach(setting => {
        insertSetting.run(setting);
      });
    }
  }

  return db;
}

// 网站管理
export function getWebsites(status?: Website['status']): Website[] {
  if (!db) return [];
  
  const query = status
    ? 'SELECT * FROM websites WHERE status = ? ORDER BY created_at DESC'
    : 'SELECT * FROM websites ORDER BY created_at DESC';
  
  return db.prepare(query).all(status);
}

export function addWebsite(website: Omit<Website, 'id' | 'visits' | 'created_at'>): Website {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare(`
    INSERT INTO websites (title, url, description, category_id, thumbnail, status)
    VALUES (@title, @url, @description, @category_id, @thumbnail, @status)
  `);
  
  const result = stmt.run(website);
  return {
    ...website,
    id: result.lastInsertRowid as number,
    visits: 0,
    created_at: new Date().toISOString(),
  };
}

export function updateWebsiteStatus(id: number, status: Website['status']) {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare('UPDATE websites SET status = ? WHERE id = ?');
  stmt.run(status, id);
}

export function deleteWebsite(id: number) {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare('DELETE FROM websites WHERE id = ?');
  stmt.run(id);
}

export function incrementVisits(id: number) {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare('UPDATE websites SET visits = visits + 1 WHERE id = ?');
  stmt.run(id);
}

// 分类管理
export function getCategories(): Category[] {
  if (!db) return [];
  
  return db.prepare('SELECT * FROM categories ORDER BY id').all();
}

export function addCategory(category: Omit<Category, 'id' | 'created_at'>): Category {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare(
    'INSERT INTO categories (name, slug) VALUES (@name, @slug)'
  );
  
  const result = stmt.run(category);
  return {
    ...category,
    id: result.lastInsertRowid as number,
    created_at: new Date().toISOString(),
  };
}

// 设置管理
export function getSetting<T>(key: string): T | null {
  if (!db) return null;
  
  const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return result ? JSON.parse(result.value) : null;
}

export function updateSetting<T>(key: string, value: T) {
  if (!db) throw new Error('Database not initialized');
  
  const stmt = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  
  stmt.run(key, JSON.stringify(value));
}

// 数据导出
export function exportData() {
  if (!db) throw new Error('Database not initialized');
  
  return {
    websites: getWebsites(),
    categories: getCategories(),
    settings: {
      general: getSetting<GeneralSettings>('general'),
      theme: getSetting<ThemeSettings>('theme'),
      oss: getSetting<OSSSettings>('oss'),
      footer: getSetting<FooterSettings>('footer'),
    },
  };
}

// 数据导入
export function importData(data: ReturnType<typeof exportData>) {
  if (!db) throw new Error('Database not initialized');
  
  db.transaction(() => {
    // 清空现有数据
    db.prepare('DELETE FROM websites').run();
    db.prepare('DELETE FROM categories').run();
    db.prepare('DELETE FROM settings').run();
    
    // 导入新数据
    const insertWebsite = db.prepare(`
      INSERT INTO websites (id, title, url, description, category_id, thumbnail, status, visits, created_at)
      VALUES (@id, @title, @url, @description, @category_id, @thumbnail, @status, @visits, @created_at)
    `);
    
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, created_at)
      VALUES (@id, @name, @slug, @created_at)
    `);
    
    const insertSetting = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (@key, @value)
    `);
    
    data.websites.forEach(website => insertWebsite.run(website));
    data.categories.forEach(category => insertCategory.run(category));
    
    Object.entries(data.settings).forEach(([key, value]) => {
      insertSetting.run({ key, value: JSON.stringify(value) });
    });
  })();
}