import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import { phash } from 'sharp-phash';
import config from '../../config.js';
import { authenticate } from '../middlewares/index.js';

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

/**
 * 检查文件是否为图片
 * @param {string} mimetype - 文件的mimetype
 * @returns {boolean} - 是否为图片
 */
function isImage(mimetype) {
    return mimetype.startsWith('image/');
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
 * 将临时文件移动到最终位置
 * @param {object} file - 上传的文件对象
 * @returns {Promise<object>} - 包含最终文件信息的对象
 */
async function moveToFinalLocation(file) {
    try {
        const tempPath = file.path;
        const fileBuffer = fs.readFileSync(tempPath);
        const ext = path.extname(file.originalname);
        
        // 计算SHA256
        const sha256 = calculateSHA256(fileBuffer);
        const finalFilename = `${sha256}${ext}`;
        
        let finalPath, relativePath;
        
        if (isImage(file.mimetype)) {
            // 计算图片的phash
            const imageHash = await phash(fileBuffer);
            const phashDir = imageHash.substring(0, 8); // 使用phash前8位作为目录名
            
            // 创建目标目录
            const targetDir = path.join(config.uploadPath, phashDir);
            fs.ensureDirSync(targetDir);
            
            finalPath = path.join(targetDir, finalFilename);
            relativePath = `${phashDir}/${finalFilename}`;
        } else {
            // 非图片文件直接存储在根目录
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
            filename: finalFilename,
            path: finalPath,
            relativePath: relativePath
        };
    } catch (error) {
        console.error('移动文件失败:', error);
        throw error;
    }
}

// 文件上传接口
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有文件被上传' });
        }
        
        // 移动到最终位置
        const finalFile = await moveToFinalLocation(req.file);
        
        // 返回文件信息
        res.status(200).json({
            message: '文件上传成功',
            file: {
                filename: finalFile.filename,
                originalname: finalFile.originalname,
                mimetype: finalFile.mimetype,
                size: finalFile.size,
                path: finalFile.relativePath
            }
        });
    } catch (error) {
        console.error('文件上传出错:', error);
        res.status(500).json({ error: '文件上传失败' });
    }
});

// 清理临时文件目录
const cleanupTempDir = () => {
    const tempDir = path.join(config.uploadPath, 'temp');
    if (fs.existsSync(tempDir)) {
        try {
            fs.emptyDirSync(tempDir);
            console.log('临时文件目录已清理');
        } catch (error) {
            console.error('清理临时文件目录失败:', error);
        }
    }
};

// 每小时清理一次临时文件
setInterval(cleanupTempDir, 3600000);

export default router;