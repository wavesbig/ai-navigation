"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { footerSettingsAtom } from '@/lib/atoms';

export function FooterSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useAtom(footerSettingsAtom);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 直接通过 atom 更新，无需额外的保存操作
      toast({
        title: '保存成功',
        description: '页脚设置已更新',
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

  const handleAddLink = () => {
    setSettings(prev => ({
      ...prev,
      links: [...prev.links, { name: '', url: '' }],
    }));
  };

  const handleRemoveLink = (index: number) => {
    setSettings(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, field: 'name' | 'url', value: string) => {
    setSettings(prev => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>页脚设置</CardTitle>
        <CardDescription>
          自定义网站页脚内容
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">版权信息</label>
          <Input
            value={settings.copyright}
            onChange={(e) => setSettings(prev => ({ ...prev, copyright: e.target.value }))}
            placeholder="输入版权信息"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ICP 备案号</label>
          <Input
            value={settings.icp}
            onChange={(e) => setSettings(prev => ({ ...prev, icp: e.target.value }))}
            placeholder="输入 ICP 备案号"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">页脚链接</label>
          {settings.links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={link.name}
                onChange={(e) => updateLink(index, 'name', e.target.value)}
                placeholder="链接名称"
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="链接地址"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRemoveLink(index)}
              >
                删除
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLink}
          >
            添加链接
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">自定义 HTML</label>
          <Textarea
            value={settings.customHtml}
            onChange={(e) => setSettings(prev => ({ ...prev, customHtml: e.target.value }))}
            placeholder="输入自定义 HTML 代码"
            className="h-32"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存设置'}
        </Button>
      </CardContent>
    </Card>
  );
}