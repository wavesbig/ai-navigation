import { prisma } from '@/lib/db';
import HomePage from '@/components/pages/home-page';
import type { Category, Website } from '@/lib/types';

export default async function Home() {
  // 在服务端获取初始数据
  const [websitesData, categoriesData] = await Promise.all([
    prisma.website.findMany({
      where: { status: 'approved' }
    }),
    prisma.category.findMany()
  ]);

  const websites: Website[] = websitesData.map(website => ({
    ...website,
    status: website.status as Website['status'],
    thumbnail: website.thumbnail || undefined,
    created_at: website.created_at.toISOString(),
    updated_at: website.updated_at.toISOString()
  }));

  const categories: Category[] = categoriesData.map(category => ({
    ...category,
    created_at: category.created_at.toISOString(),
    updated_at: category.updated_at.toISOString()
  }));

  return <HomePage initialWebsites={websites} initialCategories={categories} />;
}
