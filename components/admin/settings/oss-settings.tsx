"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ossSettingsAtom } from '@/lib/atoms';

export function OSSSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useAtom(ossSettingsAtom);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 直接通过 atom 更新，无需额外的保存操作
      toast({
        title: '保存成功',
        description: 'OSS 配置已更新',
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
        <CardTitle>OSS 配置</CardTitle>
        <CardDescription>
          配置对象存储服务，用于存储网站资源
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">存储提供商</label>
          <Select
            value={settings.provider}
            onValueChange={(value) => setSettings(prev => ({ ...prev, provider: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择存储提供商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aliyun">阿里云 OSS</SelectItem>
              <SelectItem value="qcloud">腾讯云 COS</SelectItem>
              <SelectItem value="qiniu">七牛云</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">地域节点</label>
          <Input
            value={settings.region}
            onChange={(e) => setSettings(prev => ({ ...prev, region: e.target.value }))}
            placeholder="输入地域节点"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bucket 名称</label>
          <Input
            value={settings.bucket}
            onChange={(e) => setSettings(prev => ({ ...prev, bucket: e.target.value }))}
            placeholder="输入 Bucket 名称"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">AccessKey ID</label>
          <Input
            value={settings.accessKeyId}
            onChange={(e) => setSettings(prev => ({ ...prev, accessKeyId: e.target.value }))}
            type="password"
            placeholder="输入 AccessKey ID"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">AccessKey Secret</label>
          <Input
            value={settings.accessKeySecret}
            onChange={(e) => setSettings(prev => ({ ...prev, accessKeySecret: e.target.value }))}
            type="password"
            placeholder="输入 AccessKey Secret"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">访问域名</label>
          <Input
            value={settings.endpoint}
            onChange={(e) => setSettings(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder="输入访问域名"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存设置'}
        </Button>
      </CardContent>
    </Card>
  );
}