"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { isAdminModeAtom } from "@/lib/atoms";
import { SettingsManager } from "@/components/admin/settings-manager";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function SettingsPage() {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <motion.div
      className="container max-w-6xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-1">后台管理</h1>
            <p className="text-sm text-muted-foreground">管理网站内容和系统设置</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground"
            >
              网站管理
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground"
            data-active="true"
          >
            网站设置
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-card rounded-lg border ">
          <SettingsManager />
        </div>
      </motion.div>
    </motion.div>
  );
}