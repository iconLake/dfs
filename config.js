/**
 * 系统配置文件
 */
export default {
    // 认证令牌，用于API鉴权
    token: 'dfs-auth-token-2025',
    
    // 上传文件存储路径
    uploadPath: 'public/src',
    srcBaseUrl: 'http://127.0.0.1:3000/src',
    
    // 服务器端口
    port: 3000,
    
    // 默认图片路径
    defaultImagePath: 'public/imgs/default.webp',
    
    // CORS配置
    cors: {
        // 允许的域名列表
        allowedOrigins: [
            'https://iconlake.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ]
    },
};
