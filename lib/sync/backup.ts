import { nanoid } from 'nanoid';
import { StorageManager } from './storage';
import { exportData, importData } from '../db';
import type { BackupMetadata, SyncConfig } from './types';
import type { OSSSettings } from '../atoms';

export class BackupManager {
  private storage: StorageManager;
  private autoBackupTimer: NodeJS.Timeout | null = null;

  constructor(
    private ossConfig: OSSSettings,
    private syncConfig: SyncConfig,
    private onStatusChange: (status: string) => void
  ) {
    this.storage = new StorageManager(ossConfig);
  }

  async createBackup(trigger: BackupMetadata['trigger'], description?: string): Promise<BackupMetadata> {
    try {
      this.onStatusChange('syncing');
      
      const data = exportData();
      const metadata: Omit<BackupMetadata, 'size'> = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        trigger,
        description,
      };

      const backup = await this.storage.uploadBackup(data, metadata);
      
      // 清理旧备份
      await this.storage.cleanupOldBackups(
        this.syncConfig.maxBackups,
        this.syncConfig.retentionDays
      );

      this.onStatusChange('idle');
      return backup;
    } catch (error) {
      this.onStatusChange('error');
      throw error;
    }
  }

  async restoreFromBackup(id: string): Promise<void> {
    try {
      this.onStatusChange('syncing');
      
      const { data } = await this.storage.downloadBackup(id);
      await importData(data);
      
      this.onStatusChange('idle');
    } catch (error) {
      this.onStatusChange('error');
      throw error;
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    return this.storage.listBackups();
  }

  async deleteBackup(id: string): Promise<void> {
    return this.storage.deleteBackup(id);
  }

  startAutoBackup(): void {
    if (this.autoBackupTimer) {
      clearInterval(this.autoBackupTimer);
    }

    if (!this.syncConfig.autoBackup) return;

    const interval = this.getBackupInterval();
    this.autoBackupTimer = setInterval(async () => {
      try {
        await this.createBackup('auto', '自动备份');
      } catch (error) {
        console.error('Auto backup failed:', error);
      }
    }, interval);
  }

  stopAutoBackup(): void {
    if (this.autoBackupTimer) {
      clearInterval(this.autoBackupTimer);
      this.autoBackupTimer = null;
    }
  }

  private getBackupInterval(): number {
    const intervals = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };
    return intervals[this.syncConfig.backupInterval];
  }
}