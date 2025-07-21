/**
 * 中间件聚合文件 - 导出所有中间件
 */
import { authenticate } from './auth.js';
import { errorHandler, notFoundHandler } from './error.js';

export {
    authenticate,
    errorHandler,
    notFoundHandler
};