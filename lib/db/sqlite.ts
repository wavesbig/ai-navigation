/**
 * SQLite 数据库接口
 * 注意：此文件仅包含接口定义，实际实现需要在服务端完成
 */

import type { Website, Category } from '../types';
import type { GeneralSettings, ThemeSettings, OSSSettings, FooterSettings } from '../atoms';

export interface DatabaseInterface {
  // 网站管理
  getWebsites(status?: Website['status']): Promise<Website[]>;
  addWebsite(website: Omit<Website, 'id' | 'visits' | 'created_at'>): Promise<Website>;
  updateWebsiteStatus(id: number, status: Website['status']): Promise<void>;
  deleteWebsite(id: number): Promise<void>;
  incrementVisits(id: number): Promise<void>;

  // 分类管理
  getCategories(): Promise<Category[]>;
  addCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category>;
  updateCategory(id: number, data: Partial<Category>): Promise<void>;
  deleteCategory(id: number): Promise<void>;

  // 设置管理
  getSettings<T>(key: string): Promise<T>;
  updateSettings<T>(key: string, value: T): Promise<void>;
  
  // 数据同步
  exportData(): Promise<{
    websites: Website[];
    categories: Category[];
    settings: {
      general: GeneralSettings;
      theme: ThemeSettings;
      oss: OSSSettings;
      footer: FooterSettings;
    };
  }>;
  
  importData(data: ReturnType<DatabaseInterface['exportData']>): Promise<void>;
}

// 实际实现示例（需要在服务端完成）
export class SQLiteDatabase implements DatabaseInterface {
  private db: any; // 使用实际的 SQLite 客户端

  constructor(dbPath: string) {
    // 初始化 SQLite 连接
    // this.db = new SQLite(dbPath);
  }

  // 实现所有接口方法...
}