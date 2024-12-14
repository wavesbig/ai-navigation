"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import type { Setting } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  site_name: z.string().min(2, "网站名称至少需要2个字符"),
  site_description: z.string().min(10, "网站描述至少需要10个字符"),
  site_keywords: z.string(),
  site_logo: z.string().url("请输入有效的Logo地址").optional(),
  site_icp: z.string().optional(),
  site_footer: z.string().optional(),
  items_per_page: z.string().transform(val => parseInt(val) || 12),
  enable_registration: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: "",
      site_description: "",
      site_keywords: "",
      site_logo: "",
      site_icp: "",
      site_footer: "",
      items_per_page: 12,
      enable_registration: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success) {
        const settings = data.data.reduce((acc: any, curr: Setting) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});

        // 更新表单值
        Object.keys(settings).forEach((key) => {
          if (key === "enable_registration") {
            form.setValue(key as keyof FormValues, settings[key] === "true");
          } else if (key === "items_per_page") {
            form.setValue(key as keyof FormValues, settings[key].toString());
          } else {
            form.setValue(key as keyof FormValues, settings[key]);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "加载失败",
        description: "无法加载设置",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      // 转换设置为键值对数组
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value?.toString() || "",
      }));

      // 保存所有设置
      for (const setting of settings) {
        await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(setting),
        });
      }

      toast({
        title: "保存成功",
        description: "网站设置已更新",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "保存失败",
        description: "无法保存设置",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">基本设置</h2>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            保存设置
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>网站名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入网站名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>网站 Logo</FormLabel>
                <FormControl>
                  <Input placeholder="请输入Logo地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>网站描述</FormLabel>
                <FormControl>
                  <Textarea placeholder="请输入网站描述" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_keywords"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>网站关键词</FormLabel>
                <FormControl>
                  <Input placeholder="请输入网站关键词，多个关键词用逗号分隔" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_icp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICP 备案号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入ICP备案号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="items_per_page"
            render={({ field }) => (
              <FormItem>
                <FormLabel>每页显示数量</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_footer"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>页脚内容</FormLabel>
                <FormControl>
                  <Textarea placeholder="请输入页脚内容，支持HTML" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
} 