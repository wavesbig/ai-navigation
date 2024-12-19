'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { isAdminModeAtom, footerSettingsAtom } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { FooterContentProps } from './types';

export default function FooterContent({ initialSettings }: FooterContentProps) {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [settings, setSettings] = useAtom(footerSettingsAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const { toast } = useToast();

  // Initialize settings
  useEffect(() => {
    setSettings({
      copyright: initialSettings.copyright || '',
      icpBeian: initialSettings.icpBeian || '',
      links: initialSettings.links?.map(link => ({
        name: link.title,
        url: link.url
      })) || [],
      customHtml: initialSettings.customHtml || ''
    });
  }, [initialSettings, setSettings]);

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: '错误',
        description: '请填写完整的链接信息',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/footer-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLink)
      });

      if (!response.ok) throw new Error('Failed to add link');

      setSettings(prev => ({
        ...prev,
        links: [...prev.links, { name: newLink.title, url: newLink.url }],
      }));

      setNewLink({ title: '', url: '' });
      setIsDialogOpen(false);

      toast({
        title: '添加成功',
        description: '新的页脚链接已添加',
      });
    } catch (error) {
      toast({
        title: '添加失败',
        description: '添加页脚链接时出错',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveLink = async (index: number) => {
    try {
      const response = await fetch(`/api/footer-links?id=${index}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove link');

      setSettings(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index),
      }));

      toast({
        title: '删除成功',
        description: '页脚链接已删除',
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '删除页脚链接时出错',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-t bg-white/80 dark:bg-gray-950/90 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {settings.links.length > 0 ? (
              settings.links.map((link, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
                      onClick={() => handleRemoveLink(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground/60 italic">
                {isAdmin ? '点击右侧加号添加页脚链接' : '暂无页脚链接'}
              </div>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <a
              href="https://github.com/liyown/ai-navigation"
              target="_blank"
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors"
            >
              {settings.copyright}
            </a>
            {settings.icpBeian && (
              <>
                <span className="hidden md:inline text-muted-foreground/60">|</span>
                <a 
                  href="https://beian.miit.gov.cn/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {settings.icpBeian}
                </a>
              </>
            )}
          </div>
        </div>
        {settings.customHtml && (
          <div 
            className="mt-2 text-xs text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: settings.customHtml }}
          />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加页脚链接</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">链接名称</label>
              <Input
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入链接名称"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">链接地址</label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="输入链接地址"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddLink}>
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.footer>
  );
} 