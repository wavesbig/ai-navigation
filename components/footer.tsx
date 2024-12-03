"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { isAdminModeAtom, footerSettingsAtom } from '@/lib/atoms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [settings, setSettings] = useAtom(footerSettingsAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const { toast } = useToast();

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) {
      toast({
        title: '错误',
        description: '请填写完整的链接信息',
        variant: 'destructive',
      });
      return;
    }

    setSettings(prev => ({
      ...prev,
      links: [...prev.links, newLink],
    }));

    setNewLink({ name: '', url: '' });
    setIsDialogOpen(false);

    toast({
      title: '添加成功',
      description: '新的页脚链接已添加',
    });
  };

  const handleRemoveLink = (index: number) => {
    setSettings(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));

    toast({
      title: '删除成功',
      description: '页脚链接已删除',
    });
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {settings.links.length > 0 ? (
              settings.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveLink(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground/60 italic">
                {isAdmin ? '点击右侧加号添加页脚链接' : '暂无页脚链接'}
              </div>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
            <span>{settings.copyright}</span>
            <span className="text-muted-foreground/60">|</span>
            <span>{settings.icp}</span>
          </div>
        </div>
        {settings.customHtml && (
          <div 
            className="mt-4 text-sm text-muted-foreground"
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
                value={newLink.name}
                onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
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