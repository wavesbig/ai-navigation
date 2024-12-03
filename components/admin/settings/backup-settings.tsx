"use client";

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ossSettingsAtom } from '@/lib/atoms';
import { Download, Upload, RefreshCw, Trash2, Clock } from 'lucide-react';

interface BackupHistory {
  key: string;
  timestamp: string;
  size: number;
  trigger: 'manual' | 'auto' | 'onSubmit';
}

export function BackupSettings() {
  const [isBusy, setIsBusy] = useState(false);
  const [backups, setBackups] = useState<BackupHistory[]>([]);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState('daily');
  const [backupOnSubmit, setBackupOnSubmit] = useState(false);
  const [ossSettings] = useAtom(ossSettingsAtom);
  const { toast } = useToast();

  // 加载备份历史和设置
  useEffect(() => {
    const loadBackupSettings = async () => {
      try {
        // 这里应该从数据库加载实际的备份历史和设置
        // 示例数据
        setBackups([
          {
            key: '1',
            timestamp: new Date().toISOString(),
            size: 1024,
            trigger: 'manual'
          }
        ]);
        setLastBackupTime(new Date().toISOString());
      } catch (error) {
        console.error('Failed to load backup settings:', error);
      }
    };

    loadBackupSettings();
  }, []);

  const handleCreateBackup = async () => {
    setIsBusy(true);
    try {
      // 实际的备份创建逻辑
      const newBackup: BackupHistory = {
        key: Date.now().toString(),
        timestamp: new Date().toISOString(),
        size: Math.random() * 1024,
        trigger: 'manual'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setLastBackupTime(newBackup.timestamp);
      
      toast({
        title: '备份成功',
        description: '数据已成功备份到 OSS',
      });
    } catch (error) {
      toast({
        title: '备份失败',
        description: '请检查 OSS 配置并重试',
        variant: 'destructive',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRestoreBackup = async (backup: BackupHistory) => {
    setIsBusy(true);
    try {
      // 实际的恢复逻辑
      toast({
        title: '恢复成功',
        description: `已恢复到 ${new Date(backup.timestamp).toLocaleString()} 的备份`,
      });
    } catch (error) {
      toast({
        title: '恢复失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteBackup = async (backup: BackupHistory) => {
    setIsBusy(true);
    try {
      // 实际的删除逻辑
      setBackups(prev => prev.filter(b => b.key !== backup.key));
      toast({
        title: '删除成功',
        description: '备份已删除',
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefreshBackups = async () => {
    setIsBusy(true);
    try {
      // 实际的刷新逻辑
      toast({
        title: '刷新成功',
        description: '备份列表已更新',
      });
    } catch (error) {
      toast({
        title: '刷新失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const formatBackupTrigger = (trigger: BackupHistory['trigger']) => {
    switch (trigger) {
      case 'manual': return '手动备份';
      case 'auto': return '自动备份';
      case 'onSubmit': return '提交触发';
      default: return '未知类型';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>备份设置</CardTitle>
          <CardDescription>
            配置自动备份策略和触发条件
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">自动备份</div>
              <div className="text-sm text-muted-foreground">
                定期自动备份数据到云存储
              </div>
            </div>
            <Switch
              checked={autoBackupEnabled}
              onCheckedChange={setAutoBackupEnabled}
            />
          </div>

          {autoBackupEnabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium">备份频率</label>
              <Select
                value={backupInterval}
                onValueChange={setBackupInterval}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择备份频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">每小时</SelectItem>
                  <SelectItem value="daily">每天</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">提交时备份</div>
              <div className="text-sm text-muted-foreground">
                每次提交新网站时自动备份
              </div>
            </div>
            <Switch
              checked={backupOnSubmit}
              onCheckedChange={setBackupOnSubmit}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>备份历史</CardTitle>
          <CardDescription className="flex items-center text-sm text-muted-foreground">
            {lastBackupTime ? (
              <>
                <Clock className="h-4 w-4 mr-1" />
                上次备份时间: {new Date(lastBackupTime).toLocaleString()}
              </>
            ) : (
              '暂无备份记录'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleCreateBackup}
              disabled={isBusy}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              创建备份
            </Button>
            <Button
              variant="outline"
              onClick={handleRefreshBackups}
              disabled={isBusy}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {backups.map((backup) => (
              <div
                key={backup.key}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {new Date(backup.timestamp).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>大小: {(backup.size / 1024).toFixed(2)} KB</span>
                    <span>·</span>
                    <span>{formatBackupTrigger(backup.trigger)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreBackup(backup)}
                    disabled={isBusy}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBackup(backup)}
                    disabled={isBusy}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}