"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { isAdminModeAtom } from '@/lib/atoms';
import { newsSchema } from '@/lib/validations';
import { fetchMetadata } from '@/lib/metadata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { NewsItem } from '@/lib/types';

type FormInputs = Omit<NewsItem, 'id'>;

const commonTags = [
  'GPT-4', 'OpenAI', 'Google', 'AI模型', '深度学习',
  '机器学习', '自然语言处理', '计算机视觉', '强化学习',
  'AI助手', '多模态AI', '医疗AI', '技术突破'
];

export function NewsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormInputs>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      summary: '',
      source: '',
      sourceUrl: '',
      publishDate: new Date().toISOString(),
      tags: [],
    },
  });

  const { watch, setValue } = form;
  const sourceUrl = watch('sourceUrl');
  const isValidUrl = sourceUrl && sourceUrl.startsWith('http');

  const fetchNewsMetadata = async () => {
    if (!isValidUrl) return;
    
    setIsFetching(true);
    try {
      const metadata = await fetchMetadata(sourceUrl);
      if (metadata.title) setValue('title', metadata.title);
      if (metadata.description) setValue('summary', metadata.description);
      if (metadata.image) setValue('thumbnail', metadata.image);
      
      toast({
        title: '获取成功',
        description: '资讯信息已自动填充',
      });
    } catch (error) {
      toast({
        title: '获取元数据失败',
        description: '请手动填写资讯信息',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags(prev => [...prev, customTag]);
      setCustomTag('');
    }
  };

  const onSubmit = async (values: FormInputs) => {
    if (selectedTags.length === 0) {
      toast({
        title: '请选择标签',
        description: '至少需要选择一个标签',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 这里应该调用实际的 API
      // const response = await submitNews({
      //   ...values,
      //   tags: selectedTags,
      // });

      toast({
        title: '提交成功！',
        description: isAdmin ? '资讯已发布。' : '资讯已提交审核。',
      });

      router.push('/news');
    } catch (error) {
      toast({
        title: '错误',
        description: '提交失败，请重试。',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            资讯链接
          </label>
          <div className="space-y-2">
            <Input
              {...form.register('sourceUrl')}
              placeholder="https://example.com/news"
            />
            <Button
              type="button"
              variant="outline"
              onClick={fetchNewsMetadata}
              disabled={!isValidUrl || isFetching || isSubmitting}
              className="w-full"
            >
              {isFetching ? '获取中...' : '自动获取资讯信息'}
            </Button>
          </div>
          {form.formState.errors.sourceUrl && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.sourceUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            资讯标题
          </label>
          <Input
            {...form.register('title')}
            placeholder="输入资讯标题"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            资讯摘要
          </label>
          <Textarea
            {...form.register('summary')}
            placeholder="输入资讯摘要"
            className="h-32"
          />
          {form.formState.errors.summary && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.summary.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            来源名称
          </label>
          <Input
            {...form.register('source')}
            placeholder="输入来源名称"
          />
          {form.formState.errors.source && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.source.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            缩略图地址（可选）
          </label>
          <Input
            {...form.register('thumbnail')}
            placeholder="https://example.com/image.jpg"
          />
          {form.formState.errors.thumbnail && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.thumbnail.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            标签
          </label>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="添加自定义标签"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomTag}
                disabled={!customTag}
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '提交中...' : '提交资讯'}
      </Button>
    </form>
  );
}