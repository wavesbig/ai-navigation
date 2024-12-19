// ==UserScript==
// @name         AI Navigation Collector
// @namespace    https://www.liuyaowen.cn
// @version      1.2.1
// @description  一键收藏网站到 AI 导航
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      www.liuyaowen.cn
// @icon         https://www.liuyaowen.cn/favicon.ico
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        apiEndpoint: 'https://www.liuyaowen.cn/api',
        submitWebsiteEndpoint: 'https://www.liuyaowen.cn/api/websites',
        categoriesEndpoint: 'https://www.liuyaowen.cn/api/categories'
    };

    // 样式
    const STYLES = `
        .ai-nav-collector {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .ai-nav-btn {
            padding: 10px 18px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(135deg, #0070f3 0%, #00a6ed 100%);
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-weight: 500;
        }

        .ai-nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ai-nav-btn:active {
            transform: translateY(0);
        }

        .ai-nav-btn svg {
            width: 16px;
            height: 16px;
        }

        .ai-nav-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .ai-nav-modal.show {
            opacity: 1;
            visibility: visible;
        }

        .ai-nav-modal-content {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            transform: translateY(20px);
            transition: all 0.3s ease;
            -webkit-overflow-scrolling: touch;
        }

        .ai-nav-modal.show .ai-nav-modal-content {
            transform: translateY(0);
        }

        .ai-nav-modal-header {
            margin-bottom: 20px;
        }

        .ai-nav-modal-title {
            font-size: 20px;
            font-weight: 600;
            color: #111;
            margin: 0;
        }

        .ai-nav-modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #666;
        }

        .ai-nav-form-group {
            margin-bottom: 16px;
        }

        .ai-nav-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #444;
            margin-bottom: 8px;
        }

        .ai-nav-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .ai-nav-input:focus {
            outline: none;
            border-color: #0070f3;
            box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
        }

        .ai-nav-categories {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 8px;
            margin-bottom: 20px;
        }

        .ai-nav-category {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s;
            background: #fff;
        }

        .ai-nav-category:hover {
            border-color: #0070f3;
            background: rgba(0, 112, 243, 0.05);
        }

        .ai-nav-category.selected {
            background: #0070f3;
            border-color: #0070f3;
            color: #fff;
        }

        .ai-nav-submit {
            position: relative;
            width: 100%;
            padding: 12px;
            background: #0070f3;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .ai-nav-submit:hover {
            background: #0060df;
        }

        .ai-nav-submit:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .ai-nav-submit.loading {
            background: #0070f3;
            cursor: wait;
        }

        .ai-nav-submit .spinner {
            display: none;
            width: 16px;
            height: 16px;
            border: 2px solid #fff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spinner 0.8s linear infinite;
        }

        .ai-nav-submit.loading .spinner {
            display: block;
        }

        @keyframes spinner {
            to {
                transform: rotate(360deg);
            }
        }

        @media (max-width: 768px) {
            .ai-nav-collector {
                bottom: 80px;
                right: 16px;
            }
            
            .ai-nav-btn {
                padding: 12px;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ai-nav-btn svg {
                width: 20px;
                height: 20px;
            }
            
            .ai-nav-btn span {
                display: none;
            }
            
            .ai-nav-modal-content {
                padding: 16px;
                width: 100%;
                max-width: none;
                border-radius: 16px 16px 0 0;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                max-height: 85vh;
                transform: translateY(100%);
            }
            
            .ai-nav-modal.show .ai-nav-modal-content {
                transform: translateY(0);
            }
            
            .ai-nav-modal-close {
                top: 16px;
                right: 16px;
            }
            
            .ai-nav-categories {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .ai-nav-category {
                padding: 10px;
                font-size: 13px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ai-nav-input {
                font-size: 16px;
                padding: 10px;
            }
            
            .ai-nav-submit {
                padding: 14px;
                margin-top: 16px;
                position: sticky;
                bottom: 0;
                background: #0070f3;
                border-radius: 12px;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .ai-nav-form-group {
                margin-bottom: 12px;
            }
            
            .ai-nav-label {
                font-size: 13px;
                margin-bottom: 6px;
            }
            
            .ai-nav-btn:active,
            .ai-nav-category:active,
            .ai-nav-submit:active {
                opacity: 0.7;
            }
            
            @media (prefers-color-scheme: dark) {
                .ai-nav-modal-content {
                    border-top: 1px solid #333;
                }
                
                .ai-nav-submit {
                    background: #0070f3;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
                }
            }
            
            @supports (padding-bottom: env(safe-area-inset-bottom)) {
                .ai-nav-modal-content {
                    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
                }
                
                .ai-nav-collector {
                    bottom: calc(80px + env(safe-area-inset-bottom));
                }
            }
        }

        @media (prefers-color-scheme: dark) {
            .ai-nav-modal-content {
                background: #1a1a1a;
            }
            .ai-nav-modal-title {
                color: #fff;
            }
            .ai-nav-label {
                color: #ccc;
            }
            .ai-nav-input {
                background: #2a2a2a;
                border-color: #333;
                color: #fff;
            }
            .ai-nav-category {
                background: #2a2a2a;
                border-color: #333;
                color: #fff;
            }
            .ai-nav-category:hover {
                background: rgba(0, 112, 243, 0.15);
            }
        }

        .ai-nav-icon-preview {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .ai-nav-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            object-fit: contain;
            background: #f5f5f5;
            padding: 4px;
        }

        @media (prefers-color-scheme: dark) {
            .ai-nav-icon {
                background: #2a2a2a;
            }
        }

        .ai-nav-category-error {
            text-align: center;
            color: #666;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 14px;
        }

        .ai-nav-category {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .category-icon {
            font-size: 16px;
        }

        @media (prefers-color-scheme: dark) {
            .ai-nav-category-error {
                background: #2a2a2a;
                color: #999;
            }
        }

        /* 自定义通知样式 */
        .ai-nav-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            max-width: 300px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .ai-nav-notification.show {
            transform: translateX(0);
        }

        .ai-nav-notification-icon {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ai-nav-notification-content {
            flex-grow: 1;
        }

        .ai-nav-notification-title {
            font-weight: 600;
            font-size: 14px;
            margin: 0 0 4px;
            color: #333;
        }

        .ai-nav-notification-text {
            font-size: 13px;
            color: #666;
            margin: 0;
            line-height: 1.4;
        }

        .ai-nav-notification.success .ai-nav-notification-icon {
            color: #10B981;
        }

        .ai-nav-notification.error .ai-nav-notification-icon {
            color: #EF4444;
        }

        @media (prefers-color-scheme: dark) {
            .ai-nav-notification {
                background: #1a1a1a;
            }
            .ai-nav-notification-title {
                color: #fff;
            }
            .ai-nav-notification-text {
                color: #999;
            }
        }

        @media (max-width: 768px) {
            .ai-nav-notification {
                top: auto;
                bottom: 90px;
                left: 20px;
                right: 20px;
                transform: translateY(120%);
            }
            .ai-nav-notification.show {
                transform: translateY(0);
            }
        }
    `;

    // 工具函数
    const utils = {
        // 获取页面元数据
        getMetadata() {
            console.log('正在获取页面元数据...');
            const metadata = {
                title: document.title.split(' - ')[0].split(' | ')[0].trim(),
                url: window.location.href,
                description: '',
                thumbnail: '',
                icon: ''
            };

            try {
                // 获取描述
                const descriptionMeta = document.querySelector('meta[name="description"]') ||
                                      document.querySelector('meta[property="og:description"]');
                if (descriptionMeta) {
                    metadata.description = descriptionMeta.getAttribute('content');
                    console.log('找到页面描述:', metadata.description);
                } else {
                    // 如果没有描述，尝试获取第一段文字
                    const firstParagraph = document.querySelector('p');
                    if (firstParagraph) {
                        metadata.description = firstParagraph.textContent.trim().slice(0, 200);
                        console.log('使用第一段文字作为描述:', metadata.description);
                    } else {
                        console.log('未找到页面描述');
                    }
                }

                // 获取缩略图
                const thumbnailMeta = document.querySelector('meta[property="og:image"]') ||
                                    document.querySelector('meta[name="twitter:image"]');
                if (thumbnailMeta) {
                    metadata.thumbnail = thumbnailMeta.getAttribute('content');
                    console.log('找到面缩略图:', metadata.thumbnail);
                }

                // 获取网站���标
                const iconLinks = [
                    // 优先获取高清图标
                    ...Array.from(document.querySelectorAll('link[rel="icon"][sizes="32x32"], link[rel="icon"][sizes="48x48"], link[rel="icon"][sizes="64x64"]')),
                    // 其次是 apple-touch-icon
                    ...Array.from(document.querySelectorAll('link[rel="apple-touch-icon"]')),
                    // 然后是普通图标
                    ...Array.from(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')),
                    // 最后使用默认 favicon.ico
                    { href: new URL('/favicon.ico', window.location.origin).href }
                ];

                // 获取第一个有效的图标链接
                for (const link of iconLinks) {
                    const iconUrl = link.href;
                    if (iconUrl) {
                        metadata.icon = iconUrl;
                        console.log('找到网站图标:', metadata.icon);
                        break;
                    }
                }

                if (!metadata.icon) {
                    console.log('未找到网站图标，使用默认 favicon.ico');
                }

                console.log('元数据获取完成:', metadata);
                return metadata;
            } catch (error) {
                console.error('获取元数据时出错:', error);
                return metadata;
            }
        },

        // 发送 API 请求
        async sendRequest(endpoint, data) {
            console.log(`正在发送请求到 ${endpoint}`, data);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(data),
                    onload: (response) => {
                        console.log('收到响应:', response);
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log('解析响应:', result);
                            if (result.success && result.code === 200) {
                                resolve(result);
                            } else {
                                reject(result.message || '提交失败');
                            }
                        } catch (error) {
                            console.error('解析响应失败:', error);
                            reject('请求失败: ' + error.message);
                        }
                    },
                    onerror: (error) => {
                        console.error('请求失败:', error);
                        reject('网络错误: ' + error.message);
                    }
                });
            });
        },

        // 获取分类列表
        async getCategories() {
            console.log('正在获取分类列表...');
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CONFIG.categoriesEndpoint,
                    headers: {
                        'Accept': 'application/json'
                    },
                    onload: (response) => {
                        console.log('收到分类列表响应:', response);
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log('解析分类列表:', result);
                            if (result.success) {
                                resolve(result.data || []);
                            } else {
                                reject(result.message || '获取分类失败');
                            }
                        } catch (error) {
                            console.error('解析分类列表失败:', error);
                            reject('获取分类失败: ' + error.message);
                        }
                    },
                    onerror: (error) => {
                        console.error('获取分类列表失败:', error);
                        reject('网络错误: ' + error.message);
                    }
                });
            });
        },

        // 显示通知
        notify(title, text, type = 'success') {
            console.log(`显示通知: ${title} - ${text} (${type})`);
            
            // 检测是否为移动设备
            const isMobile = window.innerWidth <= 768;
            
            // 在移动端优先使用自定义通知，在桌面端优先使用 GM_notification
            if (!isMobile && typeof GM_notification !== 'undefined') {
                try {
                    GM_notification({
                        title,
                        text,
                        timeout: 5000,
                        onclick: () => {
                            console.log('通知被点击');
                            if (type === 'error') {
                                console.log('详细错误信息:', text);
                            }
                        }
                    });
                    return;
                } catch (error) {
                    console.log('GM_notification 不可用，使用自定义通知');
                }
            }

            // 使用自定义通知
            const notification = document.createElement('div');
            notification.className = `ai-nav-notification ${type}`;
            
            const icon = type === 'success' 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
            
            notification.innerHTML = `
                <div class="ai-nav-notification-icon">${icon}</div>
                <div class="ai-nav-notification-content">
                    <h4 class="ai-nav-notification-title">${title}</h4>
                    <p class="ai-nav-notification-text">${text}</p>
                </div>
            `;

            // 移除可能存在的旧通知
            const existingNotifications = document.querySelectorAll('.ai-nav-notification');
            existingNotifications.forEach(n => n.remove());

            document.body.appendChild(notification);
            
            // 强制重绘以触发动画
            notification.offsetHeight;
            notification.classList.add('show');

            // 5秒后移除通知
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        },

        // 添加样式
        addStyles() {
            const style = document.createElement('style');
            style.textContent = STYLES;
            document.head.appendChild(style);
        },

        // 创建按钮
        createButton(icon, text, onClick) {
            const button = document.createElement('button');
            button.className = 'ai-nav-btn';
            button.innerHTML = `${icon}<span>${text}</span>`;
            button.onclick = onClick;
            return button;
        },

        // 创建模态框
        createModal() {
            const modal = document.createElement('div');
            modal.className = 'ai-nav-modal';
            modal.innerHTML = `
                <div class="ai-nav-modal-content">
                    <button class="ai-nav-modal-close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="ai-nav-modal-header">
                        <h3 class="ai-nav-modal-title">收藏网站</h3>
                    </div>
                    <form class="ai-nav-form">
                        <div class="ai-nav-form-group">
                            <label class="ai-nav-label">网站图标</label>
                            <div class="ai-nav-icon-preview">
                                <img src="" alt="网站图标" class="ai-nav-icon">
                                <input type="hidden" name="icon" value="">
                            </div>
                        </div>
                        <div class="ai-nav-form-group">
                            <label class="ai-nav-label">网站标题</label>
                            <input type="text" class="ai-nav-input" name="title" required>
                        </div>
                        <div class="ai-nav-form-group">
                            <label class="ai-nav-label">网站描述</label>
                            <textarea class="ai-nav-input" name="description" rows="3" required></textarea>
                        </div>
                        <div class="ai-nav-form-group">
                            <label class="ai-nav-label">选择分类</label>
                            <div class="ai-nav-categories"></div>
                        </div>
                        <button type="submit" class="ai-nav-submit" disabled>
                            <span class="spinner"></span>
                            <span class="text">确认提交</span>
                        </button>
                    </form>
                </div>
            `;

            // 关闭按钮事件
            modal.querySelector('.ai-nav-modal-close').onclick = () => {
                modal.classList.remove('show');
            };

            // 点击背景关闭
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            };

            return modal;
        }
    };

    // 主要功能
    const collector = {
        modal: null,
        categories: [],
        selectedCategory: null,

        async init() {
            console.log('初始化收藏工具...');
            utils.addStyles();
            this.createUI();
            this.modal = utils.createModal();
            document.body.appendChild(this.modal);
            
            try {
                console.log('正在加载分类...');
                this.categories = await utils.getCategories();
                console.log('分类加载完成:', this.categories);
                this.renderCategories();
            } catch (error) {
                console.error('加载分类失败:', error);
                utils.notify('初始化失败', error, 'error');
            }

            this.setupFormHandlers();
        },

        createUI() {
            const container = document.createElement('div');
            container.className = 'ai-nav-collector';
            
            // 收藏按钮
            const collectBtn = utils.createButton(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
                '收藏网站',
                () => this.showCollectModal()
            );

            container.appendChild(collectBtn);
            document.body.appendChild(container);
        },

        renderCategories() {
            const container = this.modal.querySelector('.ai-nav-categories');
            if (!this.categories || this.categories.length === 0) {
                container.innerHTML = '<div class="ai-nav-category-error">暂无可用分类</div>';
                return;
            }

            container.innerHTML = this.categories.map(category => `
                <div class="ai-nav-category" data-id="${category.id}" title="${category.description || category.name}">
                    ${category.icon ? `<span class="category-icon">${category.icon}</span>` : ''}
                    ${category.name}
                </div>
            `).join('');

            // 分类选择事件
            container.querySelectorAll('.ai-nav-category').forEach(btn => {
                btn.onclick = () => {
                    container.querySelector('.selected')?.classList.remove('selected');
                    btn.classList.add('selected');
                    this.selectedCategory = btn.dataset.id;
                    this.modal.querySelector('.ai-nav-submit').disabled = false;
                };
            });
        },

        setupFormHandlers() {
            const form = this.modal.querySelector('.ai-nav-form');
            const submitBtn = form.querySelector('.ai-nav-submit');

            const setLoading = (loading) => {
                submitBtn.classList.toggle('loading', loading);
                submitBtn.disabled = loading;
                submitBtn.querySelector('.text').textContent = loading ? '提交中...' : '确认提交';
            };

            form.onsubmit = async (e) => {
                e.preventDefault();
                
                if (!this.selectedCategory) {
                    utils.notify('提交失败', '请选择分类', 'error');
                    return;
                }
                
                const formData = new FormData(form);
                const data = {
                    title: formData.get('title').trim(),
                    description: formData.get('description').trim(),
                    url: window.location.href.trim(),
                    category_id: Number(this.selectedCategory),
                    thumbnail: (formData.get('icon') || '').trim(),
                    status: 'pending'
                };

                // 验证数据
                if (!data.title) {
                    utils.notify('提交失败', '请输入网站标题', 'error');
                    return;
                }

                // 验证 URL 格式
                try {
                    new URL(data.url);
                } catch (error) {
                    utils.notify('提交失败', '无效的网站地址格式', 'error');
                    return;
                }

                try {
                    setLoading(true);
                    utils.notify('提交中...', '正在处理您的请求');
                    const result = await utils.sendRequest(CONFIG.submitWebsiteEndpoint, data);
                    this.modal.classList.remove('show');
                    utils.notify('收藏成功 ✨', '网站已提交审核，请等待管理员审核');
                } catch (error) {
                    let errorMsg = error.message || '请稍后重试';
                    
                    // 处理常见错误
                    if (errorMsg.includes('URL already exists')) {
                        errorMsg = '该网站已经被收藏过了';
                    } else if (errorMsg.includes('Category does not exist')) {
                        errorMsg = '所选分类不存在，请重新选择';
                    } else if (errorMsg.includes('Invalid URL format')) {
                        errorMsg = '网站地址格式不正确';
                    }
                    
                    utils.notify('提交失败', errorMsg, 'error');
                    console.error('提交失败:', error);
                } finally {
                    setLoading(false);
                }
            };
        },

        showCollectModal() {
            console.log('显示收藏对话框');
            const metadata = utils.getMetadata();
            const form = this.modal.querySelector('.ai-nav-form');
            
            console.log('填充表单数据:', metadata);
            form.elements.title.value = metadata.title;
            form.elements.description.value = metadata.description;
            
            const iconImg = form.querySelector('.ai-nav-icon');
            const iconInput = form.querySelector('input[name="icon"]');
            if (metadata.icon) {
                console.log('设置网站图标:', metadata.icon);
                iconImg.src = metadata.icon;
                iconInput.value = metadata.icon;
            } else {
                console.log('使用默认图标');
                iconImg.src = 'https://www.liuyaowen.cn/favicon.ico';
                iconInput.value = '';
            }

            this.modal.classList.add('show');
            utils.notify('准备收藏', '请完善信息并选择分类');
        }
    };

    // 初始化
    console.log('开始初始化收藏工具...');
    collector.init();
})();