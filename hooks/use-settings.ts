import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface Settings {
  allowSubmissions: boolean;
  requireApproval: boolean;
  itemsPerPage: number;
  siteIcp: string;
  siteFooter: string;
}

interface SettingItem {
  key: string;
  value: string;
}

interface SettingsResponse {
  success: boolean;
  data: SettingItem[];
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const { success, data } = await response.json() as SettingsResponse;
        if (!success) throw new Error('Failed to load settings');

        // Convert array of settings to object
        const settingsObject = data.reduce((acc, { key, value }) => {
          let parsedValue: any = value;
          if (value === 'true') parsedValue = true;
          if (value === 'false') parsedValue = false;
          if (!isNaN(Number(value))) parsedValue = Number(value);
          return { ...acc, [key]: parsedValue };
        }, {} as Settings);

        setSettings(settingsObject);
      } catch (error) {
        toast({
          title: '加载设置失败',
          description: '使用默认设置继续',
          variant: 'destructive',
        });
        setSettings({
          allowSubmissions: true,
          requireApproval: true,
          itemsPerPage: 12,
          siteIcp: '',
          siteFooter: '',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  return { settings, loading };
} 