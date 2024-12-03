"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generalSettingsAtom } from '@/lib/atoms';

export function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useAtom(generalSettingsAtom);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 直接通过 atom 更新，无需额外的保存操作
      toast({
        title: '保存成功',
        description: '网站基本设置已更新',
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本设置</CardTitle>
        <CardDescription>
          设置网站的基本信息
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">网站名称</label>
          <Input
            value={settings.siteName}
            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
            placeholder="输入网站名称"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">网站描述</label>
          <Textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
            placeholder="输入网站描述"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">网站关键词</label>
          <Input
            value={settings.siteKeywords}
            onChange={(e) => setSettings(prev => ({ ...prev, siteKeywords: e.target.value }))}
            placeholder="输入网站关键词，用逗号分隔"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">联系邮箱</label>
          <Input
            value={settings.contactEmail}
            onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
            type="email"
            placeholder="输入联系邮箱"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存设置'}
        </Button>
      </CardContent>
    </Card>
  );
}