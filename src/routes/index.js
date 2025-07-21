/**
 * 主路由文件 - 聚合所有子路由
 */
import express from 'express';
import uploadRouter from './upload.js';
import defaultRouter from './default.js';

const router = express.Router();

router.use('/upload', uploadRouter);
router.use('/', defaultRouter);

export default router;