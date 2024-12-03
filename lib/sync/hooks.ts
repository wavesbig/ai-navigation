import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { ossSettingsAtom } from '../atoms';
import { syncConfigAtom, syncStatusAtom } from './config';
import { BackupManager } from './backup';

export function useBackupManager() {
  const [ossSettings] = useAtom(ossSettingsAtom);
  const [syncConfig] = useAtom(syncConfigAtom);
  const [syncStatus, setSyncStatus] = useAtom(syncStatusAtom);

  const updateStatus = (status: string) => {
    setSyncStatus(prev => ({
      ...prev,
      status: status as any,
      lastSyncTime: new Date().toISOString(),
    }));
  };

  useEffect(() => {
    // 确保有必要的配置
    if (!ossSettings.accessKeyId || !ossSettings.accessKeySecret) return;

    const manager = new BackupManager(ossSettings, syncConfig, updateStatus);

    if (syncConfig.autoBackup) {
      manager.startAutoBackup();
    }

    return () => {
      manager.stopAutoBackup();
    };
  }, [ossSettings, syncConfig, setSyncStatus]);

  return {
    syncStatus,
    syncConfig,
    createBackup: async (description?: string) => {
      const manager = new BackupManager(ossSettings, syncConfig, updateStatus);
      return manager.createBackup('manual', description);
    },
    restoreBackup: async (id: string) => {
      const manager = new BackupManager(ossSettings, syncConfig, updateStatus);
      return manager.restoreFromBackup(id);
    },
    listBackups: async () => {
      const manager = new BackupManager(ossSettings, syncConfig, updateStatus);
      return manager.listBackups();
    },
    deleteBackup: async (id: string) => {
      const manager = new BackupManager(ossSettings, syncConfig, updateStatus);
      return manager.deleteBackup(id);
    },
  };
}