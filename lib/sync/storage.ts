import OSS from 'ali-oss';
import type { OSSSettings } from '../atoms';
import type { BackupMetadata } from './types';

export class StorageManager {
  private client: OSS | null = null;

  constructor(private config: OSSSettings) {
    this.initialize();
  }

  private initialize() {
    this.client = new OSS({
      region: this.config.region,
      accessKeyId: this.config.accessKeyId,
      accessKeySecret: this.config.accessKeySecret,
      bucket: this.config.bucket,
      endpoint: this.config.endpoint,
    });
  }

  async uploadBackup(data: any, metadata: Omit<BackupMetadata, 'size'>): Promise<BackupMetadata> {
    if (!this.client) throw new Error('Storage not initialized');

    const content = JSON.stringify(data);
    const key = `backups/${metadata.id}.json`;
    
    await this.client.put(key, Buffer.from(content));
    await this.client.putMeta(key, {
      'x-oss-meta-timestamp': metadata.timestamp,
      'x-oss-meta-trigger': metadata.trigger,
      'x-oss-meta-description': metadata.description || '',
    });

    return {
      ...metadata,
      size: Buffer.byteLength(content),
    };
  }

  async downloadBackup(id: string): Promise<{ data: any; metadata: BackupMetadata }> {
    if (!this.client) throw new Error('Storage not initialized');

    const key = `backups/${id}.json`;
    const result = await this.client.get(key);
    const meta = await this.client.getMeta(key);

    const data = JSON.parse(result.content.toString());
    const metadata: BackupMetadata = {
      id,
      timestamp: meta['x-oss-meta-timestamp'],
      trigger: meta['x-oss-meta-trigger'] as BackupMetadata['trigger'],
      description: meta['x-oss-meta-description'],
      size: result.res.size,
    };

    return { data, metadata };
  }

  async listBackups(): Promise<BackupMetadata[]> {
    if (!this.client) throw new Error('Storage not initialized');

    const result = await this.client.list({
      prefix: 'backups/',
      'max-keys': 1000,
    });

    const backups: BackupMetadata[] = [];
    for (const obj of result.objects) {
      const meta = await this.client.getMeta(obj.name);
      const id = obj.name.replace('backups/', '').replace('.json', '');
      
      backups.push({
        id,
        timestamp: meta['x-oss-meta-timestamp'],
        trigger: meta['x-oss-meta-trigger'] as BackupMetadata['trigger'],
        description: meta['x-oss-meta-description'],
        size: obj.size,
      });
    }

    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async deleteBackup(id: string): Promise<void> {
    if (!this.client) throw new Error('Storage not initialized');
    await this.client.delete(`backups/${id}.json`);
  }

  async cleanupOldBackups(maxBackups: number, retentionDays: number): Promise<void> {
    const backups = await this.listBackups();
    const now = new Date().getTime();

    // 按时间排序
    backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // 删除超出数量限制的备份
    if (backups.length > maxBackups) {
      const toDelete = backups.slice(maxBackups);
      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }
    }

    // 删除超出保留天数的备份
    const retentionTime = now - (retentionDays * 24 * 60 * 60 * 1000);
    for (const backup of backups) {
      if (new Date(backup.timestamp).getTime() < retentionTime) {
        await this.deleteBackup(backup.id);
      }
    }
  }
}