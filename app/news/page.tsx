"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw } from 'lucide-react';
import { NewsGrid } from '@/components/news/news-grid';
import type { NewsItem } from '@/lib/types';

// 模拟新闻数据
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "OpenAI 发布 GPT-4 Turbo：性能提升显著，成本降低 90%",
    summary: "OpenAI 今日宣布推出 GPT-4 Turbo，新版本在性能、效率和成本方面都有重大突破。模型在多个基准测试中的表现优于前代产品，同时推理成本大幅降低。",
    source: "AI News",
    sourceUrl: "https://example.com/news/1",
    publishDate: new Date().toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    tags: ["GPT-4", "OpenAI", "AI模型", "技术突破"]
  },
  {
    id: 2,
    title: "谷歌推出新一代 AI 助手 Gemini，集成多模态能力",
    summary: "谷歌正式发布新一代 AI 助手 Gemini，支持文本、图像、音频等多模态输入，并可以无缝集成到各种应用场景中。这标志着 AI 助手进入新的发展阶段。",
    source: "Tech Daily",
    sourceUrl: "https://example.com/news/2",
    publishDate: new Date().toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1676277791608-ac54525aa049",
    tags: ["Google", "Gemini", "多模态AI", "AI助手"]
  },
  {
    id: 3,
    title: "AI 在医疗影像诊断领域取得重大突破",
    summary: "研究人员开发出新的 AI 模型，在肺癌早期诊断中准确率达到 95%，超过人类专家水平。这一突破将为医疗诊断带来革命性变化。",
    source: "Medical AI Journal",
    sourceUrl: "https://example.com/news/3",
    publishDate: new Date().toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1676277791608-ac54525aa049",
    tags: ["医疗AI", "诊断", "深度学习", "医疗创新"]
  }
];

// 所有可用标签
const allTags = Array.from(new Set(mockNews.flatMap(news => news.tags)));

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 处理搜索和标签筛选
  useEffect(() => {
    const filtered = mockNews.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 ||
        selectedTags.every(tag => item.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
    
    setNews(filtered);
  }, [searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-4xl font-bold mb-2">AI 资讯</h1>
        <p className="text-muted-foreground">
          及时了解 AI 领域的最新动态和技术突破
        </p>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索资讯..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className={isLoading ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 资讯列表 */}
      <NewsGrid news={news} />
    </div>
  );
}