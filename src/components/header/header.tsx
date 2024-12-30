"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Plus,
  Newspaper,
  Brain,
  Settings,
  LogOut,
  ChevronDown,
  Command,
  Trophy,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/ui/common/button";
import { Input } from "@/ui/common/input";
import { searchQueryAtom, isAdminModeAtom, websitesAtom } from "@/lib/atoms";
import { Rankings } from "@/components/website/rankings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/common/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/ui/common/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/common/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/common/tooltip";
import { cn } from "@/lib/utils/utils";
import type { Website } from "@/lib/types";
import { textContainerVariants } from "@/ui/animation/variants/animations";
import ThemeSwitch from "../theme-switcher/theme-switch";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 3000;

export default function Header() {
  const [opacity, setOpacity] = useState(0);
  const maxScroll = 100; // 滚动100px达到最大效果
  const [isAdmin, setIsAdmin] = useAtom(isAdminModeAtom);
  const [websites] = useAtom(websitesAtom);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRankings, setShowRankings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close rankings when switching between mobile and desktop
  useEffect(() => {
    setShowRankings(false);
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.min(scrollY / maxScroll, 1);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始检查

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePasswordDialogChange = (open: boolean) => {
    if (!open) {
      setClickCount(0);
      setPassword("");
      setError("");
    }
    setShowPasswordDialog(open);
  };

  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastClickTime > CLICK_TIMEOUT) {
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === CLICK_THRESHOLD) {
        setShowPasswordDialog(true);
      }
    }
    setLastClickTime(now);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdmin(true);
        handlePasswordDialogChange(false);
        router.push("/admin");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("登录失败，请重试");
    }
  };

  const exitAdminMode = () => {
    setIsAdmin(false);
    router.push("/");
  };

  const handleMobileRankingsClick = () => {
    setShowRankings(!showRankings);
  };

  const handleVisit = async (website: Website) => {
    try {
      await fetch(`/api/websites/${website.id}/visit`, { method: "POST" });
      window.open(website.url, "_blank");
    } catch (error) {
      console.error("Failed to record visit:", error);
      window.open(website.url, "_blank");
    }
  };

  return (
    <header
      className={cn("sticky top-0 z-50 w-full", "transition-all duration-100")}
      style={{
        background: `rgba(var(--background), ${opacity * 0.8})`,
        backdropFilter: `blur(${opacity * 8}px)`,
        WebkitBackdropFilter: `blur(${opacity * 8}px)`,
        borderBottom:
          opacity > 0 ? "1px solid rgba(var(--border), 0.1)" : "none",
      }}
    >
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Link href="/">
              <Brain className="h-6 w-6 text-primary" />
            </Link>
            <motion.div
              variants={textContainerVariants}
              initial="initial"
              whileHover="hover"
              className="flex items-center gap-0.5"
            >
              <motion.span className="font-bold text-foreground">
                AI Nav
              </motion.span>
              <motion.span
                onClick={handleTitleClick}
                className={cn(
                  "px-1.5 font-medium font-serif italic",
                  "bg-gradient-to-r from-primary via-primary/80 to-primary/60",
                  "bg-clip-text text-transparent",
                  "origin-center tracking-wider"
                )}
              >
                探索AI新世界
              </motion.span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Popover
              open={showRankings && !isMobile}
              onOpenChange={setShowRankings}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
                >
                  <Trophy className="h-4 w-4" />
                  <span>排行榜</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[400px] p-0">
                <Rankings
                  websites={websites as unknown as Website[]}
                  onVisit={handleVisit}
                />
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/scripts/tamper-monkey-script.user.js">
                    <Button variant="ghost" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      安装脚本
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-3 bg-popover text-popover-foreground">
                  <p className="font-medium mb-1">AI导航助手脚本</p>
                  <p className="text-sm text-muted-foreground">
                    功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link href="/submit">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
              >
                <Info className="h-4 w-4" />
                <span>关于</span>
              </Button>
            </Link>

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-border"
                  >
                    <Settings className="h-4 w-4" />
                    <span>管理</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 bg-popover border-border"
                >
                  <Link href="/admin">
                    <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                      <Settings className="h-4 w-4 mr-2" />
                      管理界面
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={exitAdminMode}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    退出管理
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ThemeSwitch />
          </div>

          <button className="md:hidden text-foreground/80 hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute left-0 right-0 mt-2 mx-4 rounded-lg p-4 space-y-4 shadow-lg bg-popover border border-border"
        >
          <div className="flex flex-col gap-3">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-base rounded-md h-12 hover:bg-accent hover:text-accent-foreground"
                >
                  <Command className="h-5 w-5 mr-3 text-primary" />
                  主页
                </Button>
              </Link>
              <Link href="/rankings" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-base rounded-md h-12 hover:bg-accent hover:text-accent-foreground"
                >
                  <Trophy className="h-5 w-5 mr-3 text-primary" />
                  排行榜
                </Button>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/scripts/tamper-monkey-script.user.js">
                      <Button variant="ghost" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        安装脚本
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[300px] p-4 bg-popover text-popover-foreground"
                  >
                    <p className="font-medium mb-2">AI导航助手脚本</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/submit" className="w-full">
                <Button className="w-full justify-start font-medium text-base rounded-md h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-5 w-5 mr-3" />
                  提交网站
                </Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-base rounded-md h-12 hover:bg-accent hover:text-accent-foreground"
                >
                  <Info className="h-5 w-5 mr-3 text-primary" />
                  关于
                </Button>
              </Link>
            </motion.div>

            {isAdmin && (
              <>
                <motion.div
                  className="h-px my-1 bg-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/admin" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium text-base rounded-md h-12 hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings className="h-5 w-5 mr-3 text-primary" />
                      管理界面
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-medium text-base rounded-md h-12 text-destructive hover:bg-destructive/10"
                    onClick={exitAdminMode}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    退出管理
                  </Button>
                </motion.div>
              </>
            )}

            <motion.div
              className="h-px my-1 bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            <motion.div
              className="flex justify-end pt-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ThemeSwitch />
            </motion.div>
          </div>
        </motion.div>
      </nav>

      <Dialog
        open={showPasswordDialog}
        onOpenChange={handlePasswordDialogChange}
      >
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>管理员验证</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              请输入管理员密码
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "border-input",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              确认
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
