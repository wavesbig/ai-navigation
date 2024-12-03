import { z } from 'zod';

export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
  visits: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface FormInputs {
  title: string;
  url: string;
  description: string;
  category_id: string;
  thumbnail?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishDate: string;
  thumbnail?: string;
  tags: string[];
}

export const newsSchema = z.object({
  title: z.string().min(2, '标题至少需要2个字符').max(100, '标题不能超过100个字符'),
  summary: z.string().min(10, '摘要至少需要10个字符').max(500, '摘要不能超过500个字符'),
  source: z.string().min(1, '请输入来源'),
  sourceUrl: z.string().url('请输入有效的来源链接'),
  publishDate: z.string(),
  thumbnail: z.string().url('请输入有效的图片地址').optional(),
  tags: z.array(z.string()),
});