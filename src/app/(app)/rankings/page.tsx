"use client";

import { useAtom } from "jotai";
import { websitesAtom } from "@/lib/atoms";
import { Rankings } from "@/components/website/rankings";
import { useReducedMotion } from "framer-motion";
import { Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Website } from "@/lib/types";
import useSWR, { mutate } from "swr";
import { Button } from "@/ui/common/button";
import { toast } from "@/hooks/use-toast";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("获取数据失败");
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.message || "获取数据失败");
  return data.data;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full py-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ErrorDisplay = ({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center gap-4 py-8">
    <p className="text-destructive">{error}</p>
    <Button
      variant="outline"
      size="sm"
      onClick={retry}
      className="flex items-center gap-2"
    >
      <RefreshCcw className="h-4 w-4" />
      重试
    </Button>
  </div>
);

export default function RankingsPage() {
  const [, setWebsites] = useAtom(websitesAtom);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: websites = [],
    error,
    isLoading,
  } = useSWR<Website[]>("/api/websites?status=approved", fetcher, {
    refreshInterval: 300000, // 5分钟刷新一次
    onSuccess: (data) => setWebsites(data),
    keepPreviousData: true, // 保持之前的数据
    revalidateOnMount: true, // 组件挂载时重新验证
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVisit = async (website: Website) => {
    try {
      await fetch(`/api/websites/${website.id}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      // 重新验证数据
      mutate("/api/websites?status=approved");
    } catch (error) {
      console.error("Failed to record visit:", error);
      toast({
        variant: "destructive",
        title: "记录访问失败",
        description: "请稍后重试",
      });
    } finally {
      window.open(website.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay
                error={error instanceof Error ? error.message : "获取数据失败"}
                retry={() => mutate("/api/websites?status=approved")}
              />
            ) : (
              <Rankings websites={websites} onVisit={handleVisit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
