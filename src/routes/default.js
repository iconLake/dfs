import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 默认路由 - 返回默认图片
router.get('*splat', async (req, res) => {
    try {
        const defaultImagePath = path.join(__dirname, '../../public/imgs/default.webp');
        res.sendFile(defaultImagePath, {
            maxAge: 60 * 60 * 24 * 30
        });
    } catch (error) {
        console.error('发送文件时出错:', error);
        res.status(500).send('发送文件时出错');
    }
});

export default router;