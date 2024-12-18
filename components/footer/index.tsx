import { prisma } from '@/lib/db';
import { WebsiteSettings } from '@/lib/types';
import FooterContent from './footer-content';
import type { FooterSettings } from './types';

export async function Footer() {
  // 在服务端获取数据
  const [footerLinks, settings] = await Promise.all([
    prisma.footerLink.findMany({
      select: {
        title: true,
        url: true
      },
      orderBy: {
        created_at: 'asc',
      },
    }),
    prisma.setting.findMany({
      where: {
        key: {
          in: [WebsiteSettings.siteIcp, WebsiteSettings.customHtml, WebsiteSettings.siteCopyright]
        }
      }
    })
  ]);

  // 转换设置数据为对象格式
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const footerSettings: FooterSettings = {
    links: footerLinks,
    copyright: settingsMap[WebsiteSettings.siteCopyright] || '© 2024 AI导航',
    icp: settingsMap[WebsiteSettings.siteIcp] || '',
    customHtml: settingsMap[WebsiteSettings.customHtml] || ''
  };

  return <FooterContent initialSettings={footerSettings} />;
}

export default Footer;