/**
 * 将分类、标签等字符串转换为符合 Web 规范且 URL 安全的 Slug
 * - 英文字符统一转换为小写
 * - 连续空格与下划线替换为单个连字符 -
 * - 剔除 URL 不安全与保留符号（保留中文、韩日文、字母、数字、连字符）
 * - 剔除首尾的连字符
 *
 * @param str 原始字符串
 * @returns 规整后的 Slug
 */
export const slugify = (str?: string | number | null): string => {
  if (str === undefined || str === null) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[\\/?#&%<>=+!*~'":@^$[\](){}`|,.]/g, '')
    .replace(/^-+|-+$/g, '');
};

export default slugify;
