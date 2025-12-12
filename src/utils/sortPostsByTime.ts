import type { IPost } from '../types';

/**
 * 按时间倒序排序文章（最新的在前）
 * 此函数会忽略置顶状态，仅按时间排序
 * @param posts 文章列表
 * @returns 排序后的文章列表
 */
export const sortPostsByTime = (posts: IPost[]): IPost[] => {
  if (!posts || posts.length === 0) return [];
  
  return [...posts].sort((a, b) => {
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });
};
