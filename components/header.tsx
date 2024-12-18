"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
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
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { searchQueryAtom, isAdminModeAtom, websitesAtom } from '@/lib/atoms';
import { ModeToggle } from './mode-toggle';
import { Rankings } from './website/rankings';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Website } from '@/lib/types';
import {textContainerVariants } from '@/lib/animations';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 3000;

export default function Header() {
  const [opacity, setOpacity] = useState(0);
  const maxScroll = 100; // 滚动100px达到最大效果
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminModeAtom);
  const [websites] = useAtom(websitesAtom);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close rankings when switching between mobile and desktop
  useEffect(() => {
    setShowRankings(false);
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 计算0-1之间的值
      const newOpacity = Math.min(scrollY / maxScroll, 1);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePasswordDialogChange = (open: boolean) => {
    if (!open) {
      setClickCount(0);
      setPassword('');
      setError('');
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdmin(true);
        handlePasswordDialogChange(false);
        router.push('/admin');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登录失败，请重试');
    }
  };

  const exitAdminMode = () => {
    setIsAdmin(false);
    setIsOpen(false);
    router.push('/');
  };

  const handleMobileRankingsClick = () => {
    setShowRankings(!showRankings);
    setIsOpen(false);
  };

  const handleVisit = async (website: Website) => {
    try {
      await fetch(`/api/websites/${website.id}/visit`, { method: 'POST' });
      window.open(website.url, '_blank');
    } catch (error) {
      console.error('Failed to record visit:', error);
      window.open(website.url, '_blank');
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b transition-all duration-100"
      style={{
        background: `rgba(var(--background), ${opacity * 0.3})`,
        backdropFilter: `blur(${opacity * 16}px)`,
        WebkitBackdropFilter: `blur(${opacity * 16}px)`, // Safari 支持
        borderColor: `rgba(255, 255, 255, ${opacity * 0.2})`
      }}
    >
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo and Title */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={handleTitleClick}
          >
            <Brain className="h-6 w-6 text-primary" />
            <motion.div
              variants={textContainerVariants}
              initial="initial"
              whileHover="hover"
              className="flex items-center gap-0.5"
            >
              <motion.span className="font-bold">AI Nav</motion.span>
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 px-1.5 origin-center font-medium font-serif italic"
                style={{
                  textShadow: "0 0 2px rgba(var(--primary), 0.15), 0 0 1px rgba(var(--primary), 0.1)",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                  WebkitFontSmoothing: "antialiased"
                }}
              >
                探索AI新世界
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Popover open={showRankings && !isMobile} onOpenChange={setShowRankings}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>排行榜</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[400px] p-0">
                <Rankings websites={websites} onVisit={handleVisit} />
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/scripts/ai-nav-collector.user.js">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>安装脚本</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-3">
                  <p className="font-medium mb-1">AI导航助手脚本</p>
                  <p className="text-sm text-muted-foreground">功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。</p>
                  <p className="text-sm text-muted-foreground mt-1">需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link href="/submit">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
              </Button>
            </Link>

            <Link href="/about">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>关于</span>
              </Button>
            </Link>

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>管理</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      管理界面
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exitAdminMode} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    退出管理
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute left-0 right-0 mt-2 mx-4 rounded-xl p-4 space-y-4 shadow-lg bg-background/90 backdrop-blur-xl border"
          >
            <div className="flex flex-col gap-3">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link href="/rankings" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Trophy className="h-5 w-5 mr-3 text-primary" />
                    排行榜
                  </Button>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/scripts/ai-nav-collector.user.js" className="w-full">
                        <Button variant="ghost" className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12 transition-all duration-200 hover:scale-[1.02]">
                          <Download className="h-5 w-5 mr-3 text-primary" />
                          安装脚本
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="max-w-[300px] p-4 rounded-lg border shadow-lg bg-background/90 backdrop-blur-xl"
                    >
                      <p className="font-medium mb-2 text-primary">AI导航助手脚本</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。</p>
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
                  <Button 
                    className="w-full justify-start font-medium text-base rounded-lg h-12 bg-primary/10 hover:bg-primary/15 text-primary transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Plus className="h-5 w-5 mr-3" />
                    提交网站
                  </Button>
                </Link>
                <Link href="/about" className="w-full">
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12 transition-all duration-200 hover:scale-[1.02]">
                    <Info className="h-5 w-5 mr-3 text-primary" />
                    关于
                  </Button>
                </Link>
              </motion.div>

              {isAdmin && (
                <>
                  <motion.div 
                    className="h-px my-1 bg-border/10"
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
                      <Button variant="ghost" className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12 transition-all duration-200 hover:scale-[1.02]">
                        <Settings className="h-5 w-5 mr-3 text-primary" />
                        管理界面
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start font-medium text-base rounded-lg h-12 text-destructive hover:bg-destructive/5 transition-all duration-200 hover:scale-[1.02]"
                      onClick={exitAdminMode}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      退出管理
                    </Button>
                  </motion.div>
                </>
              )}

              <motion.div 
                className="h-px my-1 bg-border/10"
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
                <ModeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Admin Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={handlePasswordDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>管理员验证</DialogTitle>
            <DialogDescription>
              请输入管理员密码
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(error && "border-red-500")}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full">
              确认
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}