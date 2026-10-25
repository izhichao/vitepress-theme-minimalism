import type { FolderOption, IFolderConfig, IPostsConfig } from '../types.ts';

export type NormalizedFolder = Required<IFolderConfig>;

/**
 * 规范化 folder 目录配置
 * 支持纯字符串、对象配置或混合写法，自动推导默认输出路径与固定链接前缀
 *
 * @param rawFolders 用户传入的 folder 配置列表
 * @param globalConfig 全局配置项（提供默认 pageSize、index 等）
 * @returns 补齐默认值后的标准化配置数组
 */
export const normalizeFolders = (
  rawFolders?: FolderOption[],
  globalConfig: IPostsConfig = {}
): NormalizedFolder[] => {
  const folders = rawFolders && rawFolders.length > 0 ? rawFolders : ['posts'];

  return folders.map((item, idx) => {
    const isFirst = idx === 0;
    const isString = typeof item === 'string';
    const input = isString ? item : item.input;
    const name = !isString && item.name ? item.name : input;

    const output = isString
      ? isFirst
        ? ''
        : input
      : item.output !== undefined
        ? item.output
        : isFirst
          ? ''
          : input;

    const permalink = isString
      ? isFirst
        ? globalConfig.permalink ?? 'posts'
        : input
      : item.permalink ?? (isFirst ? globalConfig.permalink ?? 'posts' : input);

    const index = isString
      ? isFirst
        ? (globalConfig.index ?? true)
        : true
      : item.index ?? (isFirst ? (globalConfig.index ?? true) : true);

    const pageSize = !isString && item.pageSize !== undefined ? item.pageSize : (globalConfig.pageSize ?? 10);

    return {
      input,
      name,
      output,
      permalink,
      index,
      pageSize
    };
  });
};
