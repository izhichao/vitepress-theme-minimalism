import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';

let inMemoryFolders: string[] = ['posts'];

const getCachePath = () => path.resolve('.vitepress', 'cache', 'folders.json');

/**
 * 设置分类与标签路由生成时需扫描的文章文件夹列表并持久化到缓存
 * @param folders 文章源文件夹名称列表
 */
export const setConfiguredFolders = async (folders: string[]): Promise<void> => {
  if (folders && folders.length > 0) {
    inMemoryFolders = [...new Set(folders)];
    try {
      const cacheFile = getCachePath();
      await fs.mkdir(path.dirname(cacheFile), { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify(inMemoryFolders), 'utf8');
    } catch {
      // 忽略文件写入异常
    }
  }
};

/**
 * 获取当前已配置的文章源文件夹列表（优先读取持久化缓存）
 */
export const getConfiguredFolders = async (): Promise<string[]> => {
  try {
    const cacheFile = getCachePath();
    const content = await fs.readFile(cacheFile, 'utf8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // 降级读取内存数据
  }
  return inMemoryFolders;
};

/**
 * 扫描所有文章目录，生成分类动态路由参数列表（供 category/[category].paths.ts 使用）
 */
export const getCategoryPaths = async (): Promise<Array<{ params: { category: string } }>> => {
  const folders = await getConfiguredFolders();
  const patterns = folders.map((f) => `${f}/**/*.md`);
  const ignores = folders.flatMap((f) => [`${f}/index.md`, `${f}/page-[0-9]*.md`]);

  const paths = await fg(patterns, { ignore: ignores });
  const categories = new Set<string>();
  const isProd = process.env.NODE_ENV === 'production';

  for (const postPath of paths) {
    const { data } = matter.read(postPath);
    const skip = isProd && (data.draft || data.deleted || data.hidden);

    if (data.category && !skip) {
      categories.add(String(data.category));
    }
  }

  const routePaths = [...categories].map((category) => ({
    params: { category }
  }));

  routePaths.push({ params: { category: 'index' } });

  return routePaths;
};

/**
 * 扫描所有文章目录，生成标签动态路由参数列表（供 tags/[tag].paths.ts 使用）
 */
export const getTagPaths = async (): Promise<Array<{ params: { tag: string } }>> => {
  const folders = await getConfiguredFolders();
  const patterns = folders.map((f) => `${f}/**/*.md`);
  const ignores = folders.flatMap((f) => [`${f}/index.md`, `${f}/page-[0-9]*.md`]);

  const paths = await fg(patterns, { ignore: ignores });
  const tags = new Set<string>();
  const isProd = process.env.NODE_ENV === 'production';

  for (const postPath of paths) {
    const { data } = matter.read(postPath);
    const skip = isProd && (data.draft || data.deleted || data.hidden);

    if (Array.isArray(data.tags) && !skip) {
      data.tags.forEach((tag: unknown) => {
        if (tag != null) tags.add(String(tag));
      });
    }
  }

  const routePaths = [...tags].map((tag) => ({
    params: { tag }
  }));

  routePaths.push({ params: { tag: 'index' } });

  return routePaths;
};
