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

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 3000;

export default function Header() {
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo and Title */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={handleTitleClick}
          >
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI 导航</span>
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
            className="md:hidden absolute left-0 right-0 mt-2 p-4 space-y-4 border-b bg-background/95 backdrop-blur-xl shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleMobileRankingsClick}
              >
                <Trophy className="h-4 w-4 mr-2" />
                排行榜
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/scripts/ai-nav-collector.user.js">
                      <Button variant="ghost" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        安装脚本
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
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  提交网站
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start">
                  <Info className="h-4 w-4 mr-2" />
                  关于
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      管理界面
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={exitAdminMode}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    退出管理
                  </Button>
                </>
              )}
              <ModeToggle />
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

      {/* Mobile Rankings Panel */}
      {showRankings && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-x-0 top-[4.5rem] z-50 p-4 bg-background/95 backdrop-blur-xl border-b shadow-lg md:hidden"
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 -translate-y-2"
              onClick={() => setShowRankings(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Rankings websites={websites} onVisit={handleVisit} />
          </div>
        </motion.div>
      )}
    </header>
  );
}