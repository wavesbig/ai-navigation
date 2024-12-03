"use client";

import { useAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminModeAtom } from '@/lib/atoms';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  const currentTab = pathname === '/admin' ? 'websites' : 'settings';

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Tabs value={currentTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="websites" 
            onClick={() => router.push('/admin')}
            className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            网站管理
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            onClick={() => router.push('/admin/settings')}
            className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            网站设置
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}