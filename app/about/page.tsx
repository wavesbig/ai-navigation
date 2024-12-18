import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Globe, Download, Plus, Trophy, Search, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于 AI 导航',
  description: 'AI导航是一个帮助用户发现、分享和收藏优质AI工具与资源的平台。',
};

export default function AboutPage() {
  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "发现AI工具",
      description: "精选优质AI工具和资源，帮助你找到最适合的AI解决方案"
    },
    {
      icon: <Plus className="h-6 w-6" />,
      title: "分享收藏",
      description: "发现好用的AI工具？一键分享给大家，收藏喜欢的工具"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "实时排行",
      description: "实时更新的AI工具排行榜，发现最受欢迎的AI产品"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "智能搜索",
      description: "强大的搜索功能，快速找到你需要的AI工具"
    }
  ];

  const steps = [
    {
      icon: <Download className="h-5 w-5" />,
      title: "安装助手",
      description: "安装浏览器扩展和AI导航助手脚本，一键采集AI工具信息",
      action: (
        <Link href="/scripts/ai-nav-collector.user.js">
          <Button variant="outline" size="sm" className="mt-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Download className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            安装脚本
          </Button>
        </Link>
      )
    },
    {
      icon: <Plus className="h-5 w-5" />,
      title: "提交工具",
      description: "发现好用的AI工具？点击提交按钮或使用助手快速分享",
      action: (
        <Link href="/submit">
          <Button variant="outline" size="sm" className="mt-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            提交网站
          </Button>
        </Link>
      )
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "发现使用",
      description: "通过搜索、分类、排行榜发现并使用优质AI工具",
      action: (
        <Link href="/">
          <Button variant="outline" size="sm" className="mt-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Search className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            开始探索
          </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background/50 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b group">
        <div className="container px-4 py-20 mx-auto text-center">
          <div className="relative inline-block">
            <Brain className="h-16 w-16 mx-auto text-primary mb-6 animate-float group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 animate-pulse [animation-duration:4s]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-up [animation-delay:400ms]">
            发现优质 AI 工具的最佳平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up [animation-delay:800ms] relative leading-relaxed">
            <span className="relative inline-block">
              AI导航致力于帮助用户发现、分享和收藏优质的AI工具与资源，让你的AI之旅更轻松。
              <span className="absolute -right-6 -top-6">
                <Sparkles className="h-5 w-5 text-primary animate-pulse [animation-duration:3s]" />
              </span>
            </span>
          </p>
        </div>
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient-flow opacity-30" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20 mx-auto relative overflow-hidden">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-background/30 hover:shadow-xl transition-all duration-700 hover:-translate-y-2 animate-fade-up group relative overflow-hidden backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-white/10"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 animate-background-shine" />
              <CardContent className="p-6 relative">
                <div className="text-primary mb-4 animate-bounce-subtle group-hover:scale-110 transition-transform duration-700">
                  <div className="relative">
                    {feature.icon}
                    <div className="absolute inset-0 bg-primary/20 blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-500">{feature.title}</h3>
                <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative animate-fade-up group"
              style={{ animationDelay: `${(index + 1) * 300}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary animate-pulse [animation-duration:3s] group-hover:scale-110 transition-transform duration-700">
                  {step.icon}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-500">{step.title}</h3>
              </div>
              <p className="text-muted-foreground/80 mb-4 group-hover:text-muted-foreground transition-colors duration-500">{step.description}</p>
              {step.action}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-[calc(100%+1rem)] w-8 border-t border-dashed border-border animate-border-flow overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-glow-line-horizontal" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 py-20 mx-auto text-center border-t animate-fade-up group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 animate-background-shine" />
        <h2 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors duration-500 relative">
          加入我们
          <span className="absolute -right-6 -top-6">
            <Sparkles className="h-5 w-5 text-primary animate-pulse [animation-duration:3s]" />
          </span>
        </h2>
        <p className="text-muted-foreground/80 mb-8 max-w-2xl mx-auto group-hover:text-muted-foreground transition-colors duration-500">
          我们欢迎各种形式的贡献，无论是提交新的AI工具、改进网站功能，还是提供建议和反馈。
        </p>
        <a 
          href="https://github.com/liyown/ai-navigation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group relative"
        >
          <span>访问 GitHub 仓库</span>
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-500" />
        </a>
      </section>
    </div>
  );
} 