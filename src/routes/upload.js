import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import config from '../../config.js';
import { authenticate } from '../middlewares/index.js';

const router = express.Router();

// 确保上传目录存在
fs.ensureDirSync(config.uploadPath);

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        // 使用原始文件名，但添加时间戳以避免文件名冲突
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// 文件上传接口
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有文件被上传' });
        }
        
        // 返回文件信息
        res.status(200).json({
            message: '文件上传成功',
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path
            }
        });
    } catch (error) {
        console.error('文件上传出错:', error);
        res.status(500).json({ error: '文件上传失败' });
    }
});

export default router;