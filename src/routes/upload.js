import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import config from '../../config.js';
import { authenticate } from '../middlewares/index.js';
import { getProjectRoot } from '../utils/index.js';

const router = express.Router();

// 确保上传目录存在
fs.ensureDirSync(config.uploadPath);

/**
 * 计算文件的SHA256哈希值
 * @param {Buffer} fileBuffer - 文件内容Buffer
 * @returns {string} - SHA256哈希值
 */
function calculateSHA256(fileBuffer) {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// 临时存储配置
const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(config.uploadPath, 'temp');
        fs.ensureDirSync(tempDir);
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: tempStorage });

/**
 * 检查路径是否安全（不包含目录遍历尝试）
 * @param {string} filePath - 要检查的文件路径
 * @returns {boolean} - 路径是否安全
 */
function isPathSafe(filePath) {
    // 规范化路径（解析 . 和 .. 引用）
    const normalizedPath = path.normalize(filePath);
    
    // 检查是否包含 .. 序列（可能是目录遍历尝试）
    if (normalizedPath.includes('..')) {
        return false;
    }
    
    // 确保最终路径仍在上传目录内
    const fullPath = path.join(config.uploadPath, normalizedPath);
    const relativePath = path.relative(config.uploadPath, fullPath);
    
    // 如果相对路径以 .. 开头，说明路径超出了上传目录
    return !relativePath.startsWith('..');
}

/**
 * 将临时文件移动到最终位置
 * @param {object} file - 上传的文件对象
 * @param {string} [customPath] - 自定义存储路径
 * @returns {Promise<object>} - 包含最终文件信息的对象
 */
async function moveToFinalLocation(file, customPath) {
    try {
        const tempPath = file.path;
        const fileBuffer = fs.readFileSync(tempPath);
        const ext = path.extname(file.originalname);
        
        // 计算SHA256
        const sha256 = calculateSHA256(fileBuffer);
        
        let finalPath, relativePath;
        
        if (customPath) {
            // 安全检查
            if (!isPathSafe(customPath)) {
                throw new Error('不安全的文件路径');
            }
            
            // 使用自定义路径
            const normalizedPath = path.normalize(customPath).replace(/^\/+/, ''); // 移除开头的斜杠
            const dirPath = path.dirname(normalizedPath);
            const targetDir = path.join(config.uploadPath, dirPath);
            fs.ensureDirSync(targetDir);
            
            finalPath = path.join(config.uploadPath, normalizedPath);
            relativePath = normalizedPath;
        } else {
            // 默认使用sha256作为文件名
            const finalFilename = `${sha256}${ext}`;
            finalPath = path.join(config.uploadPath, finalFilename);
            relativePath = finalFilename;
        }
        
        // 检查文件是否已存在
        if (fs.existsSync(finalPath)) {
            // 文件已存在，删除临时文件
            fs.removeSync(tempPath);
        } else {
            // 移动文件到最终位置
            fs.moveSync(tempPath, finalPath);
        }
        
        // 返回更新后的文件信息
        return {
            ...file,
            filename: path.basename(finalPath),
            path: finalPath,
            relativePath
        };
    } catch (error) {
        console.error('移动文件失败:', error);
        throw error;
    }
}

// 上传页面
router.get('/', (req, res) => {
    res.sendFile(path.join(getProjectRoot(), 'public/upload.html'));
});

// 文件上传接口
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有文件被上传' });
        }
        
        // 获取自定义路径参数
        const customPath = req.body.key || null;
        
        // 移动到最终位置
        const finalFile = await moveToFinalLocation(req.file, customPath);
        
        // 返回文件信息
        res.status(200).json({
            filename: finalFile.filename,
            originalName: finalFile.originalname,
            mimeType: finalFile.mimetype,
            size: finalFile.size,
            key: finalFile.relativePath,
            url: `${config.srcBaseUrl}${/^\//.test(finalFile.relativePath) ? '' : '/'}${finalFile.relativePath}`,
        });
    } catch (error) {
        console.error('文件上传出错:', error);
        
        // 检查是否是路径安全性错误
        if (error.message) {
            return res.status(400).json({ 
                error: error.message,
            });
        }
        
        res.status(500).json({ error: '文件上传失败' });
    }
});

export default router;