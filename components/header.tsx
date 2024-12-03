"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Search, Menu, X, Plus, Newspaper } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { searchQueryAtom, isAdminModeAtom } from '@/lib/atoms';
import { ModeToggle } from './mode-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const ADMIN_PASSWORD = '123456';
const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 3000;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminModeAtom);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleTitleClick = useCallback(() => {
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
  }, [clickCount, lastClickTime]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      setPassword('');
      setError('');
      router.push('/admin');
    } else {
      setError('密码错误');
    }
  };

  const exitAdminMode = () => {
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity" onClick={handleTitleClick}>
              网站导航
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索网站..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
            
            <Link href="/news">
              <Button variant="ghost" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span>AI资讯</span>
              </Button>
            </Link>

            <Link href="/submit">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
              </Button>
            </Link>

            {isAdmin && (
              <>
                <Button
                  variant="destructive"
                  onClick={exitAdminMode}
                >
                  退出管理
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

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
            <div className="flex flex-col space-y-2">
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
                    <Button variant="outline" className="w-full">
                      管理界面
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={exitAdminMode}
                  >
                    退出管理
                  </Button>
                </>
              )}
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </nav>

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