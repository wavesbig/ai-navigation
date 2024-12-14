const { prisma } = require('./prisma');
import type { Prisma, PrismaClient, Category } from '@prisma/client';

const defaultCategories = [
  { name: 'AI 聊天', slug: 'ai-chat' },
  { name: 'AI 绘画', slug: 'ai-art' },
  { name: 'AI 写作', slug: 'ai-writing' },
  { name: 'AI 编程', slug: 'ai-coding' },
  { name: 'AI 工具', slug: 'ai-tools' },
  { name: '大语言模型', slug: 'llm' },
];

interface WebsiteInput {
  title: string;
  url: string;
  description: string;
  category_slug: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const defaultWebsites = [
  {
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的 AI 聊天助手，能够进行自然对话并协助完成各种任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic 开发的 AI 助手，擅长写作、分析和编程等任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://claude.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '强大的 AI 绘画工具，可以通过文字描述生成高质量图片。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.midjourney.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'GitHub 和 OpenAI 合作开发的 AI 编程助手，提供智能代码补全。',
    category_slug: 'ai-coding',
    thumbnail: 'https://github.com/favicon.ico',
    status: 'approved',
  },
] as WebsiteInput[];

const defaultSettings = [
  { key: 'allowSubmissions', value: 'true' },
  { key: 'requireApproval', value: 'true' },
  { key: 'itemsPerPage', value: '12' },
  { key: 'siteIcp', value: '' },
  { key: 'siteFooter', value: '© 2024 AI导航. All rights reserved.' },
  { key: 'adminPassword', value: process.env.ADMIN_PASSWORD || 'admin' },
];

interface FooterLinkInput {
  title: string;
  url: string;
}

const defaultFooterLinks: FooterLinkInput[] = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: '关于我们', url: '/about' },
  { title: '使用条款', url: '/terms' },
  { title: '隐私政策', url: '/privacy' },
];

export async function initializeData() {
  try {
    // 初始化分类
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    // 获取所有分类的映射
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c: Category) => [c.slug, c.id])
    );

    // 初始化网站
    for (const website of defaultWebsites) {
      const { category_slug, ...websiteData } = website;
      const category_id = categoryMap.get(category_slug);
      
      if (category_id) {
        const createData: Prisma.WebsiteCreateInput = {
          ...websiteData,
          category: { 
            connect: { id: Number(category_id) } 
          }
        };

        const updateData: Prisma.WebsiteUpdateInput = {
          ...websiteData,
          category: { 
            connect: { id: Number(category_id) } 
          }
        };

        const existingWebsite = await prisma.website.findUnique({
          where: { url: website.url }
        });

        if (existingWebsite) {
          await prisma.website.update({
            where: { id: existingWebsite.id },
            data: updateData
          });
        } else {
          await prisma.website.create({
            data: createData
          });
        }
      }
    }

    // 初始化设置
    for (const setting of defaultSettings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    // 初始化页脚链接
    for (const link of defaultFooterLinks) {
      const existingLink = await prisma.footerLink.findUnique({
        where: { url: link.url }
      });

      if (existingLink) {
        await prisma.footerLink.update({
          where: { id: existingLink.id },
          data: link
        });
      } else {
        await prisma.footerLink.create({
          data: link
        });
      }
    }

    console.log('数据初始化完成');
  } catch (error) {
    console.error('数据初始化失败:', error);
    throw error;
  }
}

module.exports = {
  initializeData
}; 