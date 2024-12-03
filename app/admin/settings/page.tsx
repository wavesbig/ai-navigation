"use client";

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isAdminModeAtom } from '@/lib/atoms';
import { GeneralSettings } from '@/components/admin/settings/general-settings';
import { ThemeSettings } from '@/components/admin/settings/theme-settings';
import { OSSSettings } from '@/components/admin/settings/oss-settings';
import { FooterSettings } from '@/components/admin/settings/footer-settings';
import { BackupSettings } from '@/components/admin/settings/backup-settings';

export default function SettingsPage() {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();

  useEffect(() => {
    // 如果不是管理员模式，重定向到首页
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold mb-2">网站设置</h1>
        <p className="text-muted-foreground">管理网站的全局设置和偏好</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="theme">主题风格</TabsTrigger>
          <TabsTrigger value="footer">页脚设置</TabsTrigger>
          <TabsTrigger value="oss">OSS 配置</TabsTrigger>
          <TabsTrigger value="backup">数据备份</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="footer">
          <FooterSettings />
        </TabsContent>

        <TabsContent value="oss">
          <OSSSettings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}