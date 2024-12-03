// ==UserScript==
// @name         AI Navigation Collector
// @namespace    https://ai-nav.vercel.app
// @version      1.0.0
// @description  一键收藏网站和资讯到 AI 导航
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      ai-nav.vercel.app
// @icon         https://ai-nav.vercel.app/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        apiEndpoint: 'https://ai-nav.vercel.app/api',
        submitWebsiteEndpoint: 'https://ai-nav.vercel.app/api/submit',
        submitNewsEndpoint: 'https://ai-nav.vercel.app/api/news/submit',
        submitPageEndpoint: 'https://ai-nav.vercel.app/submit',
        newsSubmitPageEndpoint: 'https://ai-nav.vercel.app/news/submit'
    };

    // 样式
    const STYLES = `
        .ai-nav-collector {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            display: flex;
            gap: 8px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .ai-nav-btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            background: #000;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .ai-nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ai-nav-btn svg {
            width: 16px;
            height: 16px;
        }

        .ai-nav-btn.website {
            background: #0070f3;
        }

        .ai-nav-btn.news {
            background: #6366f1;
        }

        @media (max-width: 768px) {
            .ai-nav-collector {
                bottom: 70px;
            }
            .ai-nav-btn span {
                display: none;
            }
            .ai-nav-btn {
                padding: 8px;
                border-radius: 50%;
            }
        }
    `;

    // 工具函数
    const utils = {
        // 获取页面元数据
        getMetadata() {
            const metadata = {
                title: document.title,
                url: window.location.href,
                description: '',
                thumbnail: '',
                source: window.location.hostname
            };

            // 获取描述
            const descriptionMeta = document.querySelector('meta[name="description"]') ||
                                  document.querySelector('meta[property="og:description"]');
            if (descriptionMeta) {
                metadata.description = descriptionMeta.getAttribute('content');
            }

            // 获取缩略图
            const thumbnailMeta = document.querySelector('meta[property="og:image"]') ||
                                document.querySelector('meta[name="twitter:image"]');
            if (thumbnailMeta) {
                metadata.thumbnail = thumbnailMeta.getAttribute('content');
            }

            return metadata;
        },

        // 发送 API 请求
        async sendRequest(endpoint, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: endpoint,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve(result);
                            } else {
                                reject(result.error);
                            }
                        } catch (error) {
                            reject('请求失败');
                        }
                    },
                    onerror: () => reject('网络错误')
                });
            });
        },

        // 显示通知
        notify(title, text, type = 'success') {
            GM_notification({
                title,
                text,
                timeout: 3000,
                onclick: () => window.open(CONFIG.submitPageEndpoint, '_blank')
            });
        },

        // 添加样式
        addStyles() {
            const style = document.createElement('style');
            style.textContent = STYLES;
            document.head.appendChild(style);
        },

        // 创建按钮
        createButton(type, icon, text, onClick) {
            const button = document.createElement('button');
            button.className = `ai-nav-btn ${type}`;
            button.innerHTML = `${icon}<span>${text}</span>`;
            button.onclick = onClick;
            return button;
        }
    };

    // 主要功能
    const collector = {
        init() {
            utils.addStyles();
            this.createUI();
            this.registerCommands();
        },

        createUI() {
            const container = document.createElement('div');
            container.className = 'ai-nav-collector';

            // 收藏网站按钮
            const websiteBtn = utils.createButton(
                'website',
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
                '收藏网站',
                () => this.collectWebsite()
            );

            // 收藏资讯按钮
            const newsBtn = utils.createButton(
                'news',
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
                '收藏资讯',
                () => this.collectNews()
            );

            container.appendChild(websiteBtn);
            container.appendChild(newsBtn);
            document.body.appendChild(container);
        },

        registerCommands() {
            GM_registerMenuCommand('收藏网站 (Alt+S)', () => this.collectWebsite());
            GM_registerMenuCommand('收藏资讯 (Alt+N)', () => this.collectNews());

            // 快捷键
            document.addEventListener('keydown', (e) => {
                if (e.altKey) {
                    if (e.key === 's') this.collectWebsite();
                    if (e.key === 'n') this.collectNews();
                }
            });
        },

        async collectWebsite() {
            try {
                const metadata = utils.getMetadata();
                
                // 先尝试直接提交
                const result = await utils.sendRequest(CONFIG.submitWebsiteEndpoint, {
                    title: metadata.title,
                    url: metadata.url,
                    description: metadata.description,
                    thumbnail: metadata.thumbnail
                });

                utils.notify(
                    '收藏成功',
                    '网站已提交审核，请等待管理员审核'
                );
            } catch (error) {
                // 如果 API 提交失败，打开提交页面
                const submitUrl = new URL(CONFIG.submitPageEndpoint);
                submitUrl.searchParams.set('url', metadata.url);
                submitUrl.searchParams.set('title', metadata.title);
                submitUrl.searchParams.set('description', metadata.description);
                if (metadata.thumbnail) {
                    submitUrl.searchParams.set('thumbnail', metadata.thumbnail);
                }

                window.open(submitUrl.toString(), '_blank');
                utils.notify('打开提交页面', '请在新页面完成提交');
            }
        },

        async collectNews() {
            try {
                const metadata = utils.getMetadata();
                
                // 先尝试直接提交
                const result = await utils.sendRequest(CONFIG.submitNewsEndpoint, {
                    title: metadata.title,
                    summary: metadata.description,
                    source: metadata.source,
                    sourceUrl: metadata.url,
                    thumbnail: metadata.thumbnail
                });

                utils.notify(
                    '收藏成功',
                    '资讯已提交审核，请等待管理员审核'
                );
            } catch (error) {
                // 如果 API 提交失败，打开提交页面
                const submitUrl = new URL(CONFIG.newsSubmitPageEndpoint);
                submitUrl.searchParams.set('url', metadata.url);
                submitUrl.searchParams.set('title', metadata.title);
                submitUrl.searchParams.set('summary', metadata.description);
                if (metadata.thumbnail) {
                    submitUrl.searchParams.set('thumbnail', metadata.thumbnail);
                }

                window.open(submitUrl.toString(), '_blank');
                utils.notify('打开提交页面', '请在新页面完成提交');
            }
        }
    };

    // 初始化
    collector.init();
})();