"use client";

import { useEffect, useState } from "react";

/**
 * 检查媒体查询是否匹配
 * @example
 * ```ts
 * import { useMediaQuery } from "@/hooks/use-media-query";
 *
 * // 在组件中使用:
 * const isMobile = useMediaQuery("(max-width: 768px)"); // 返回 true 表示匹配查询条件
 * ```
 * @param query 媒体查询字符串
 * @returns 是否匹配查询条件
 */
export function useMediaQuery(query: string): boolean {
  // 初始化为 null 避免水合不匹配
  const [matches, setMatches] = useState<boolean>(() => {
    // 仅在客户端运行
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const updateMatches = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 设置初始值
    setMatches(mediaQuery.matches);

    // 添加监听器
    mediaQuery.addEventListener("change", updateMatches);

    // 清理
    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}
