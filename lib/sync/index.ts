import OSS from 'ali-oss';
import { exportData, importData } from '../db';
import type { OSSSettings } from '../atoms';

let ossClient: OSS | null = null;

// 初始化 OSS 客户端
export function initOSS(config: OSSSettings) {
  ossClient = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    endpoint: config.endpoint,
  });
}

// 创建备份
export async function createBackup() {
  if (!ossClient) throw new Error('OSS client not initialized');
  
  const data = exportData();
  const timestamp = new Date().toISOString();
  const key = `backups/${timestamp}.json`;
  
  await ossClient.put(key, Buffer.from(JSON.stringify(data)));
  
  return {
    key,
    timestamp,
    size: Buffer.byteLength(JSON.stringify(data)),
  };
}

// 从备份恢复
export async function restoreFromBackup(key: string) {
  if (!ossClient) throw new Error('OSS client not initialized');
  
  const result = await ossClient.get(key);
  const data = JSON.parse(result.content.toString());
  
  importData(data);
}

// 列出所有备份
export async function listBackups() {
  if (!ossClient) throw new Error('OSS client not initialized');
  
  const result = await ossClient.list({
    prefix: 'backups/',
    'max-keys': 1000,
  });
  
  return result.objects.map(obj => ({
    key: obj.name,
    timestamp: obj.name.replace('backups/', '').replace('.json', ''),
    size: obj.size,
  }));
}

// 删除备份
export async function deleteBackup(key: string) {
  if (!ossClient) throw new Error('OSS client not initialized');
  
  await ossClient.delete(key);
}

// 自动备份管理
let autoBackupInterval: NodeJS.Timeout | null = null;

export function enableAutoBackup(interval: number) {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
  }
  
  autoBackupInterval = setInterval(async () => {
    try {
      await createBackup();
      console.log('Auto backup created successfully');
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }, interval);
}

export function disableAutoBackup() {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
    autoBackupInterval = null;
  }
}