# AI 导航 | AI Navigation

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-13.5.1-black)

</div>

## 📖 简介

AI 导航是一个现代化的人工智能网站导航系统，致力于帮助用户发现、分享和管理优质的 AI 工具与资源。项目采用最新的 Web 技术栈构建，提供流畅的用户体验和强大的管理功能。

### ✨ 特性

- 🎯 **精选内容**: 严选优质 AI 网站，分类清晰直观
- 🔍 **智能搜索**: 支持多搜索引擎集成和实时搜索
- 🎨 **现代设计**: 精美的 UI 设计，支持浅色/深色主题
- 📱 **响应式**: 完美适配桌面端、平板和移动设备
- 🚀 **智能抓取**: 自动获取网站标题、描述和图片
- 👮‍♂️ **后台管理**: 完善的管理员功能和审核机制
- 💾 **数据安全**: 支持数据备份与云端同步
- ⚙️ **高可配置**: 可自定义主题、样式和页面布局

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

1. 克隆项目:
```bash
git clone https://github.com/yourusername/ai-navigation.git
cd ai-navigation
```

2. 安装依赖:
```bash
npm install
```

3. 配置环境变量:
```bash
cp .env.example .env.local
```

4. 启动开发服务器:
```bash
npm run dev
```

### 部署方式

#### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fai-navigation)

1. 点击上方按钮，使用 Vercel 一键部署
2. 配置必要的环境变量
3. 等待部署完成

#### Docker 部署

1. 构建镜像:
```bash
docker build -t ai-navigation .
```

2. 运行容器:
```bash
docker run -d \
  -p 3000:3000 \
  -v ./data:/app/data \
  --name ai-navigation \
  ai-navigation
```

## 🔧 核心功能

### 网站管理

- **网站提交**
  - 支持手动填写和自动抓取
  - 分类管理和标签系统
  - 审核流程和状态追踪

- **资讯管理**
  - AI 相关新闻和资讯
  - 自动获取文章摘要
  - 支持多媒体内容

### 浏览器扩展

- **一键收藏**
  - 支持快速收藏网站和资讯
  - 自动提取网页元数据
  - 快捷键操作支持

#### 安装油猴脚本

1. 安装浏览器扩展
   - Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 安装收藏脚本
   - 点击 [安装脚本](https://ai-nav.vercel.app/scripts/ai-nav-collector.user.js)
   - 或手动复制 `scripts/ai-nav-collector.user.js` 内容创建新脚本

3. 使用方法
   - 浮动按钮：页面右下角的收藏按钮
   - 快捷键：
     - `Alt + S`: 收藏网站
     - `Alt + N`: 收藏资讯
   - 右键菜单：通过 Tampermonkey 扩展菜单操作

4. 功能特性
   - 自动提取网页标题、描述和缩略图
   - 支持移动端响应式布局
   - 可自定义快捷键
   - 收藏成功提醒

### 系统设置

- **主题定制**
  - 自定义颜色方案
  - 卡片样式选择
  - 深色模式支持

- **数据同步**
  - 阿里云 OSS 备份
  - 自动备份策略
  - 数据恢复功能

## 🔒 管理员功能

### 访问方式

1. 进入管理模式:
   - 在网站标题处快速点击 5 次
   - 输入默认密码: `123456`

2. 管理功能:
   - 网站审核与管理
   - 系统设置
   - 数据备份
   - 主题定制

### 功能说明

- **内容管理**
  - 网站审核流程
  - 分类管理
  - 资讯管理
  - 用户反馈

- **系统配置**
  - 基本设置
  - 主题设置
  - OSS 配置
  - 备份管理
  - 页脚设置

## 🛠️ 技术栈

- **前端框架**: 
  - Next.js 13 (App Router)
  - React 18
  - TypeScript

- **状态管理**: 
  - Jotai

- **UI 框架**: 
  - Tailwind CSS
  - shadcn/ui
  - Framer Motion

- **数据存储**: 
  - SQLite
  - 阿里云 OSS

- **工具链**:
  - React Hook Form
  - Zod
  - Lucide React

## 📝 开发指南

### 项目结构

```
ai-navigation/
├── app/                # Next.js 应用目录
├── components/         # React 组件
├── lib/               # 工具函数和类型定义
├── public/            # 静态资源
├── scripts/           # 油猴脚本
└── styles/            # 全局样式
```

### 开发规范

1. 代码风格
   - 使用 TypeScript
   - 遵循 ESLint 配置
   - 使用 Prettier 格式化

2. 组件开发
   - 使用函数组件
   - 遵循 React Hooks 规范
   - 组件文档化

3. 提交规范
   - 语义化提交信息
   - 提交前代码检查
   - 分支管理规范

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

## 🙏 致谢

感谢以下开源项目的贡献：

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Jotai](https://jotai.org/)

## 📞 联系我们

- 问题反馈: [GitHub Issues](https://github.com/yourusername/ai-navigation/issues)
- 邮件联系: your-email@example.com

---

<div align="center">

**AI 导航** © 2024 Made with ❤️ 

</div>