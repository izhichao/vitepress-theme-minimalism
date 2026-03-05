import { createHash } from 'crypto';

/**
 * 将明文密码转为 SHA-256 哈希（Node.js 端）
 * @param password 明文密码
 * @returns 十六进制哈希字符串
 */
export const hashPassword = (password: string): string => {
  return createHash('sha256').update(String(password)).digest('hex');
};
