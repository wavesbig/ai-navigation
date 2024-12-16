import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeWrapper } from '@/components/theme-wrapper';
import { prisma } from '@/lib/db';
import { Analytics } from '@/components/analytics';
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { WebsiteSettings } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.setting.findMany();
    
    const settingsMap = settings.reduce((acc: Record<string, string>, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return {
      title: settingsMap.title || 'AI导航',
      description: settingsMap.description || '发现、分享和收藏优质AI工具与资源，让你的人工智能生活更美好',
      icons: {
        icon: '/logo.png',
      },
      keywords: ['AI导航', 'AI工具', '人工智能', 'AI资源', 'AI网站导航'],
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'AI导航',
      description: '发现、分享和收藏优质AI工具与资源，让你的人工智能生活更美好',
      icons: {
        icon: 'static/logo.png',
      },
      keywords: ['AI导航', 'AI工具', '人工智能', 'AI资源', 'AI网站导航'],
    };
  }
}



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleAnalytics = await prisma.setting.findFirst({ where: { key: WebsiteSettings.googleAnalytics } });
  const baiduAnalytics = await prisma.setting.findFirst({ where: { key: WebsiteSettings.baiduAnalytics } });

  return (
    <html lang="zh-CN" suppressHydrationWarning >
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeWrapper>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
              <Analytics 
                googleAnalyticsId={googleAnalytics?.value} 
                baiduAnalyticsId={baiduAnalytics?.value} 
              />
            </ThemeWrapper>
          </ThemeProvider>
        </StoreProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}