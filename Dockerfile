# 使用 Node.js 官方镜像作为基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 只复制必要的文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 安装 SQLite3
RUN apk add --no-cache sqlite

# 创建数据目录
RUN mkdir -p /app/data && chown -R node:node /app/data

# 使用非 root 用户运行应用
USER node

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]