import config from '../../config.js';

/**
 * 鉴权中间件
 * 验证请求头中的 Authorization 是否包含正确的 Token
 */
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token || token !== `Bearer ${config.token}`) {
        return res.status(401).json({ error: '未授权访问' });
    }
    
    next();
};