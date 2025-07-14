/**
 * 错误处理中间件
 * 捕获并处理应用中的错误
 */
export const errorHandler = (err, req, res) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
};

/**
 * 404 处理中间件
 * 处理未找到的路由
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({ error: '请求的资源不存在' });
};