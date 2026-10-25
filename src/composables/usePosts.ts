import type { IPost, IPostsConfig } from '../types.ts';
import { normalizeFolders } from '../utils/normalizeFolder.ts';
import { scanAndParsePosts } from '../utils/postScanner.ts';
import { generateFolderPages } from '../utils/generatePages.ts';
import { setConfiguredFolders } from '../utils/taxonomyPaths.ts';
import { setThemePageContext } from '../utils/transformPageData.ts';

const isProd = process.env.NODE_ENV === 'production';

/**
 * 按照置顶（order）与发布时间对文章列表进行排序
 * @param posts 待排序文章列表
 */
const sortPosts = (posts: IPost[]): IPost[] => {
  return [...posts].sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.order) return -1;
    if (b.order) return 1;
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });
};

/**
 * 初始化并构建博客文章数据
 *
 * 核心流程：
 * 1. 规范化 folder 目录配置（首项输出到根目录，后续项独立成目录）。
 * 2. 批量扫描解析 Markdown 文件，生成摘要、自定义 permalink 与路由重写表。
 * 3. 各文章目录独立维护排序，供各自列表和 PrevNext 组件运行时精准隔离。
 * 4. 为每个目录静态生成各自的分页 Markdown 页面（/page-*.md、/essays/page-*.md 等）。
 * 5. 全局汇总所有文章，供给分类、标签、归档页面全局共享。
 *
 * @param userConfig 用户配置项
 * @param userConfig.folder 文章源目录，支持简写如 ['posts', 'essays'] 或详细对象配置
 * @param userConfig.pageSize 全局默认每页文章数量，默认 10
 * @param userConfig.index 全局默认首个目录是否生成 index.md 作为首页，默认 true
 * @param userConfig.excerpt 自动截取摘要的字数长度，默认 0
 * @param userConfig.permalink 全局默认固定链接前缀，默认 'posts'
 * @returns 包含全站文章、隐藏文章集合、排除构建文章与路由重写表的对象
 *
 * @example
 * ```ts
 * // 极简模式：首项目录输出到根目录，后续目录独立输出
 * const { posts, rewrites } = await usePosts({
 *   pageSize: 6,
 *   folder: ['posts', 'essays']
 * });
 * ```
 */
export const usePosts = async (userConfig: IPostsConfig = {}) => {
  const folders = normalizeFolders(userConfig.folder, userConfig);

  // 记录已配置的所有源文件夹，供分类与标签静态路由生成时使用
  await setConfiguredFolders(folders.map((f) => f.input));

  try {
    // 1. 扫描并解析全部目录下的文章
    const { allPosts, descriptionMap, rewrites, hiddenPosts, excludePosts } =
      await scanAndParsePosts(folders, userConfig);

    // 同步目录配置与摘要映射供页面元数据转换（transformPageData）使用
    setThemePageContext(folders, descriptionMap);

    // 2. 区分可见文章（生产环境过滤隐藏与草稿）
    const visiblePosts = isProd
      ? allPosts.filter((post) => !post.hidden && !post.draft && !post.deleted)
      : allPosts;

    // 3. 各文件夹组内独立排序，获取文章数量并生成分页（首页额外汇聚所有 order 置顶文章及 index: true 文章）
    const firstFolder = folders[0]?.input;
    for (const folder of folders) {
      const isRoot = folder.input === firstFolder;
      const groupPosts = sortPosts(
        visiblePosts.filter(
          (post) => post.folder === folder.input || (isRoot && (Boolean(post.order) || Boolean(post.index)))
        )
      );
      await generateFolderPages(folder, groupPosts.length);
    }

    // 4. 全局排序汇总文章列表，供分类、标签、归档等共享使用
    const posts = sortPosts(visiblePosts);

    return { posts, hiddenPosts, excludePosts, rewrites };
  } catch (e) {
    console.error('[vitepress-theme-minimalism] usePosts 处理异常:', e);
    return {
      posts: [],
      hiddenPosts: new Set<string>(),
      excludePosts: [],
      rewrites: {}
    };
  }
};
