"use client";

import { useState } from 'react';
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
  Trophy
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
  const router = useRouter();

  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastClickTime > CLICK_TIMEOUT) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(now);

    if (clickCount + 1 === CLICK_THRESHOLD) {
      setShowPasswordDialog(true);
      setClickCount(0);
    }
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
        setShowPasswordDialog(false);
        setPassword('');
        setError('');
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
    router.push('/');
  };

  const handleVisit = async (website: Website) => {
    await fetch(`/api/websites/${website.id}/visit`, { method: 'POST' });
    window.open(website.url, '_blank');
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
            {/* <div className="relative flex items-center">
              <Command className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索网站..."
                className="pl-10 w-64 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
            
            <Popover open={showRankings} onOpenChange={setShowRankings}>
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

            {/* <Link href="/news">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span>AI资讯</span>
              </Button>
            </Link> */}

            <Link href="/submit">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
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
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <Input
              type="search"
              placeholder="搜索网站..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setShowRankings(!showRankings)}
              >
                <Trophy className="h-4 w-4 mr-2" />
                排行榜
              </Button>
              <Link href="/news">
                <Button variant="ghost" className="w-full justify-start">
                  <Newspaper className="h-4 w-4 mr-2" />
                  AI资讯
                </Button>
              </Link>
              <Link href="/submit">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  提交网站
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
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
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
      {isOpen && showRankings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-x-0 top-[4.5rem] z-50 p-4 bg-background/95 backdrop-blur-xl border-b shadow-lg md:hidden"
        >
          <Rankings websites={websites} onVisit={handleVisit} />
        </motion.div>
      )}
    </header>
  );
}