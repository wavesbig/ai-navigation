"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ColorPicker } from '@/components/admin/settings/color-picker';
import { themeSettingsAtom, type CardStyle } from '@/lib/atoms';

const cardStyles: { value: CardStyle; label: string; description: string }[] = [
  {
    value: 'default',
    label: '默认样式',
    description: '经典的卡片样式，带有阴影和边框'
  },
  {
    value: 'minimal',
    label: '简约风格',
    description: '无边框和阴影，简洁清爽'
  },
  {
    value: 'gradient',
    label: '渐变风格',
    description: '带有柔和的渐变背景'
  },
  {
    value: 'glass',
    label: '毛玻璃',
    description: '磨砂玻璃效果，现代感强'
  },
  {
    value: 'bordered',
    label: '描边风格',
    description: '突出的边框设计，清晰的边界'
  }
];

export function ThemeSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useAtom(themeSettingsAtom);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 直接通过 atom 更新，无需额外的保存操作
      toast({
        title: '保存成功',
        description: '主题设置已更新',
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
        <CardTitle>主题设置</CardTitle>
        <CardDescription>
          自定义网站的视觉风格
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">卡片样式</label>
          <Select
            value={settings.cardStyle}
            onValueChange={(value: CardStyle) => setSettings(prev => ({ ...prev, cardStyle: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择卡片样式" />
            </SelectTrigger>
            <SelectContent>
              {cardStyles.map(style => (
                <SelectItem key={style.value} value={style.value}>
                  <div className="space-y-1">
                    <div>{style.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {style.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">主色调</label>
          <ColorPicker
            color={settings.primaryColor}
            onChange={(color) => setSettings(prev => ({ ...prev, primaryColor: color }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">次要色调</label>
          <ColorPicker
            color={settings.secondaryColor}
            onChange={(color) => setSettings(prev => ({ ...prev, secondaryColor: color }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">卡片圆角</label>
          <Input
            value={settings.cardRadius}
            onChange={(e) => setSettings(prev => ({ ...prev, cardRadius: e.target.value }))}
            placeholder="例如: 0.5rem"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">深色模式</div>
            <div className="text-sm text-muted-foreground">
              启用后允许用户切换深色模式
            </div>
          </div>
          <Switch
            checked={settings.enableDarkMode}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDarkMode: checked }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">自定义 CSS</label>
          <textarea
            value={settings.customCss}
            onChange={(e) => setSettings(prev => ({ ...prev, customCss: e.target.value }))}
            className="w-full h-32 px-3 py-2 text-sm border rounded-md"
            placeholder="输入自定义 CSS 代码"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存设置'}
        </Button>
      </CardContent>
    </Card>
  );
}