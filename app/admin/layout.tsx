"use client";

import { useAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminModeAtom } from '@/lib/atoms';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();
  const pathname = usePathname();

  if (!isAdmin) {
    router.push('/');
    return null;
  }

  const currentTab = pathname === '/admin' ? 'websites' : 'settings';

  return (
    <div className="space-y-8">
      <Tabs value={currentTab} className="w-full">
        <TabsList>
          <TabsTrigger value="websites" onClick={() => router.push('/admin')}>网站管理</TabsTrigger>
          <TabsTrigger value="settings" onClick={() => router.push('/admin/settings')}>网站设置</TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}