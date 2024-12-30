import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { Toaster } from "@/ui/common/sonner";
import Header from "@/components/header/header";
import Footer from "@/components/footer/index";
import SWRProvider from "@/components/providers/swr-provider";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Analytics as OtherAnalytics } from "@/components/analytics";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <SWRProvider>
              <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 -z-10" />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </SWRProvider>
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
        <VercelAnalytics />
        <OtherAnalytics googleAnalyticsId="G-9MNGY82H1J" />
      </body>
    </html>
  );
}
