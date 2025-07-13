/**
 * 工具函数集合
 * 可以在这里添加各种通用工具函数
 */

import { fileURLToPath } from "url";

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期字符串
 */
export const formatDateTime = (date = new Date()) => {
    return date.toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} - 随机字符串
 */
export const generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * 获取项目根目录路径
 * @returns {string} - 项目根目录路径
 */
export const getProjectRoot = () => {
    return fileURLToPath(new URL('../../', import.meta.url));
};

/**
 * 将二进制字符串转换为Hex
 * @param {string} binaryString - 二进制字符串
 * @returns {string} - 转换后的Hex
 */
export const binaryStringToHex = (binaryString) => {
    // 确保二进制字符串长度是8的倍数（在开头补零）
    const padding = '0'.repeat((8 - (binaryString.length % 8)) % 8);
    const paddedBinary = padding + binaryString;
    
    // 按8位一组分割并转换为十六进制
    let hexString = '';
    for (let i = 0; i < paddedBinary.length; i += 8) {
        const byte = paddedBinary.substring(i, i + 8);
        const decimal = parseInt(byte, 2);
        // 将十进制转换为两位十六进制（不足两位补零）
        hexString += decimal.toString(16).padStart(2, '0');
    }
    
    return hexString;
};
