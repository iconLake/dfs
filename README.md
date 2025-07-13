# DFS - 分布式文件服务

一个简单的分布式文件服务系统，用于文件上传和访问。

## 功能特点

- 文件上传：支持通过 API 上传文件
- 文件访问：通过 URL 直接访问上传的文件
- 身份验证：基于 Token 的简单身份验证
- 默认图片：访问不存在的文件时返回默认图片

## 安装

```bash
# 克隆仓库
git clone <repository-url>
cd dfs

# 安装依赖
npm install
```

## 配置

编辑 `config.js` 文件以配置服务：

```javascript
export default {
    token: 'your-auth-token',  // 认证令牌
    uploadPath: 'public/src',   // 上传文件存储路径
    port: 3000                  // 服务器端口
};
```

## 使用方法

### 启动服务

开发模式 (带文件监听):
```bash
npm run dev
```

生产模式:
```bash
npm run prod
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
pm2 start ecosystem.config.cjs --env production
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

### 上传文件

使用 POST 请求上传文件：

```bash
curl -X POST \
  -H "Authorization: Bearer your-auth-token" \
  -F "file=@/path/to/your/file.jpg" \
  http://localhost:3000/upload
```

### 访问文件

上传成功后，可以通过以下 URL 访问文件：

```
http://localhost:3000/src/filename.jpg
```

如果文件不存在，将返回默认图片。

## API 参考

### POST /upload

上传文件。

**请求头：**
- `Authorization: Bearer your-auth-token`

**请求体：**
- `file`: 要上传的文件（multipart/form-data）

**响应：**
```json
{
  "message": "文件上传成功",
  "file": {
    "filename": "uploaded-filename.jpg",
    "originalname": "original-filename.jpg",
    "mimetype": "image/jpeg",
    "size": 12345,
    "path": "public/src/uploaded-filename.jpg"
  }
}
```

## 许可证

MIT