import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeWrapper } from '@/components/theme-wrapper';

export const metadata: Metadata = {
  title: '网站导航',
  description: '精选优质网站导航',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans min-h-screen flex flex-col">
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeWrapper>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
            </ThemeWrapper>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}