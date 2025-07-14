# DFS - 去中心化文件服务

一个简单的去中心化文件服务系统，用于文件上传和访问。

## 功能特点

- 文件上传：支持通过 API 上传文件
- 文件访问：通过 URL 直接访问上传的文件
- 身份验证：基于 Token 的简单身份验证
- 默认图片：访问不存在的文件时返回默认图片

## 安装

```bash
# 克隆仓库
git clone https://github.com/iconLake/dfs.git
cd dfs

# 安装依赖
pnpm install
```

## 配置

编辑 `config.js` 文件以配置服务

## 使用方法

### 启动服务

开发模式 (带文件监听):

```bash
pnpm run dev
```

生产模式:

```bash
pnpm run pro
```

停止服务:

```bash
npm run stop
```

重启服务:

```bash
npm run restart
```

### 生产环境部署

1. 安装 PM2 (如果尚未安装):

    ```bash
    npm install pm2 -g
    ```

2. 启动生产环境服务:

    ```bash
    pnpm run pro
    ```

3. 设置开机自启:

    ```bash
    pm2 startup
    pm2 save
    ```

### 日志管理

查看实时日志:

```bash
pm2 logs
```

查看特定应用日志:

```bash
pm2 logs dfs
```

日志文件位置:

- 标准输出: `./logs/out.log`
- 错误日志: `./logs/error.log`

## 许可证

MIT
