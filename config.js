/**
 * 系统配置文件
 */
export default {
    // 认证令牌，用于API鉴权
    token: 'dfs-auth-token-2023',
    
    // 上传文件存储路径
    uploadPath: 'public/src',
    
    // 服务器端口
    port: 3000,
    
    // 默认图片路径
    defaultImagePath: 'public/imgs/default.webp',
    
    // CORS配置
    cors: {
        // 允许的域名列表
        allowedOrigins: [
            'https://iconlake.com'
        ]
    }
};