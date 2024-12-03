"use client";

import { useState } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { isAdminModeAtom, footerSettingsAtom } from '@/lib/atoms';
import { useToast } from '@/hooks/use-toast';
import { FooterLink } from './footer-link';
import { FooterDialog } from './footer-dialog';

export default function Footer() {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [settings, setSettings] = useAtom(footerSettingsAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddLink = (name: string, url: string) => {
    setSettings(prev => ({
      ...prev,
      links: [...prev.links, { name, url }],
    }));

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
      className="relative w-full border-t bg-gradient-to-b from-background/50 to-background"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Links Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {settings.links.length > 0 ? (
                settings.links.map((link, index) => (
                  <FooterLink
                    key={index}
                    name={link.name}
                    url={link.url}
                    isAdmin={isAdmin}
                    onRemove={() => handleRemoveLink(index)}
                  />
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
                  onClick={() => setIsDialogOpen(true)}
                  className="h-7 px-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground/80 shrink-0">
            <span className="whitespace-nowrap">{settings.copyright}</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="whitespace-nowrap">{settings.icp}</span>
          </div>
        </div>

        {/* Custom HTML Section */}
        {settings.customHtml && (
          <div 
            className="mt-4 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: settings.customHtml }}
          />
        )}
      </div>

      <FooterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddLink}
      />
    </motion.footer>
  );
}