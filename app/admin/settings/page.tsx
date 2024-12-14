"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { isAdminModeAtom } from "@/lib/atoms";
import { SettingsManager } from "@/components/admin/settings-manager";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

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
  const [settings, setSettings] = useState({
    title: '',
    description: '',
    keywords: '',
    logo: '',
    siteIcp: '',
    siteFooter: '',
    allowSubmissions: 'true',
    requireApproval: 'true',
    itemsPerPage: '12',
    adminPassword: '',
    siteUrl: '',
    siteEmail: '',
    siteCopyright: '',
    googleAnalytics: '',
    baiduAnalytics: '',
    copyright: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    // 页面加载时获取设置
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data.data || {})
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      }).then(res => res.json());
      
      if (!response.success) {
        toast({
          title: '保存设置失败',
          description: response.message,
        })
      } else {
        toast({
          title: '设置已保存',
          description: '网站设置已成功保存',
        })
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: '保存设置失败', 
        description: '请重试',
      })
    }
  };

  if (!isAdmin) return null;

  if (loading) {
    return <div>Loading...</div>
  }

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
        <div className="bg-card rounded-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">网站名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.title || ''}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">网站描述</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.description || ''}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">关键词</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.keywords || ''}
                  onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.logo || ''}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ICP备案号</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.siteIcp || ''}
                  onChange={(e) => setSettings({ ...settings, siteIcp: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">页脚文本</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.siteFooter || ''}
                  onChange={(e) => setSettings({ ...settings, siteFooter: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">每页显示数量</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.itemsPerPage || '12'}
                  onChange={(e) => setSettings({ ...settings, itemsPerPage: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">允许提交</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.allowSubmissions}
                  onChange={(e) => setSettings({ ...settings, allowSubmissions: e.target.value })}
                >
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">需要审核</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.value })}
                >
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">管理员密码</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.adminPassword || ''}
                  onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                  placeholder="留空则不修改密码"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">网站URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.siteUrl || ''}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">联系邮箱</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.siteEmail || ''}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">版权信息</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.copyright || ''}
                  onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Google Analytics ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.googleAnalytics || ''}
                  onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                  placeholder="例如: G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">百度统计ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.baiduAnalytics || ''}
                  onChange={(e) => setSettings({ ...settings, baiduAnalytics: e.target.value })}
                  placeholder="例如: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-4 py-2">
                保存设置
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}