"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FooterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, url: string) => void;
}

export function FooterDialog({ open, onOpenChange, onSubmit }: FooterDialogProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    onSubmit(name, url);
    setName('');
    setUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加页脚链接</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">链接名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入链接名称"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">链接地址</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入链接地址"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={!name || !url}>
              添加
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}