import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Globe, Download, Plus, Trophy, Search, ExternalLink } from 'lucide-react';
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
          <Button variant="outline" size="sm" className="mt-2">
            <Download className="h-4 w-4 mr-2" />
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
          <Button variant="outline" size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
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
          <Button variant="outline" size="sm" className="mt-2">
            <Search className="h-4 w-4 mr-2" />
            开始探索
          </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container px-4 py-20 mx-auto text-center">
          <Brain className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            发现优质 AI 工具的最佳平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI导航致力于帮助用户发现、分享和收藏优质的AI工具与资源，让你的AI之旅更轻松。
          </p>
        </div>
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              {step.action}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-[calc(100%+1rem)] w-8 border-t border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 py-20 mx-auto text-center border-t">
        <h2 className="text-2xl font-bold mb-6">加入我们</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          我们欢迎各种形式的贡献，无论是提交新的AI工具、改进网站功能，还是提供建议和反馈。
        </p>
        <a 
          href="https://github.com/liyown/ai-navigation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>访问 GitHub 仓库</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
} 