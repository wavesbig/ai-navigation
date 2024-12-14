"use client";

import { useAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminModeAtom } from '@/lib/atoms';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}