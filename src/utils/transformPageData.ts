import type { PageData, TransformPageContext } from 'vitepress';
import type { NormalizedFolder } from './normalizeFolder.ts';
import type { ThemeTransformPageData } from '../types.ts';

let cachedFolders: NormalizedFolder[] = [];
let cachedDescriptionMap = new Map<string, string>();

/**
 * 暂存主题页面转换所需的上下文（在 usePosts 扫描文章完成后自动调用）
 * @param folders 规范化后的文章目录配置数组
 * @param descMap 文章 ID 与摘要映射表
 */
export const setThemePageContext = (
  folders: NormalizedFolder[],
  descMap: Map<string, string>
): void => {
  cachedFolders = folders;
  cachedDescriptionMap = descMap;
};

/**
 * 解析当前页面的语言标识（同时支持单语言 site.lang 与多语言 site.locales 配置）
 */
const resolvePageLang = (pageData: PageData, ctx?: TransformPageContext): string => {
  const site = ctx?.siteConfig?.site;
  if (!site) return 'zh';

  const locales = site.locales;
  if (locales) {
    const relPath = pageData.relativePath;
    for (const [key, config] of Object.entries(locales)) {
      if (key !== 'root' && (relPath.startsWith(`${key}/`) || relPath === `${key}.md`)) {
        return (config as any).lang || 'en';
      }
    }
    if (locales.root?.lang) {
      return locales.root.lang;
    }
  }

  return site.lang || 'zh';
};

/**
 * 主题专属页面数据转换函数（直接作为 VitePress transformPageData 钩子或在自定义钩子中手动调用）
 * 1. 过滤 frontmatter.password，防止加密文章密码打包至客户端
 * 2. 补全缺失的 description，生成 meta description 标签
 * 3. 动态计算分页与多目录列表页面的 title，消除 SEO Duplicate Title
 *
 * @param pageData VitePress 页面数据
 * @param ctx VitePress 页面转换上下文
 */
export const themeTransformPageData: ThemeTransformPageData = (
  pageData: PageData,
  ctx?: TransformPageContext
): void => {
  const { frontmatter } = pageData;
  if (frontmatter) {
    // 1. 安全过滤：移除 frontmatter 中的密码明文，防止其作为 pageData 被序列化进客户端 JS bundle 造成泄露
    delete frontmatter.password;

    // 2. SEO 优化：若页面未显式定义 description，则自动注入构建期提取的摘要，供 SSR 输出 <meta name="description">
    if (!pageData.description && frontmatter.id) {
      const desc = cachedDescriptionMap.get(frontmatter.id);
      if (desc) pageData.description = desc;
    }
  }

  const lang = resolvePageLang(pageData, ctx);
  const isZh = lang.startsWith('zh');

  // 1. 处理动态分类页面标题（如 /category/散文 -> "分类：散文"）
  if (pageData.params?.category) {
    const category = pageData.params.category as string;
    if (category && category !== 'index') {
      pageData.title = isZh ? `分类：${category}` : `Category: ${category}`;
      return;
    }
    if (category === 'index' && !isZh) {
      pageData.title = 'Category';
      return;
    }
  }

  // 2. 处理动态标签页面标题（如 /tags/生活 -> "标签：生活"）
  if (pageData.params?.tag) {
    const tag = pageData.params.tag as string;
    if (tag && tag !== 'index') {
      pageData.title = isZh ? `标签：${tag}` : `Tag: ${tag}`;
      return;
    }
    if (tag === 'index' && !isZh) {
      pageData.title = 'Tag';
      return;
    }
  }

  // 3. 处理归档页面英文标题
  if (pageData.relativePath === 'archives.md' && !isZh) {
    pageData.title = 'Archives';
    return;
  }

  // 4. 处理网站真正的主首页（index.md）
  if (pageData.relativePath === 'index.md' && !pageData.title) {
    pageData.title = isZh ? '首页' : 'Home';
    return;
  }

  if (pageData.title) return;

  for (const folder of cachedFolders) {
    const { output, name, input } = folder;
    const folderName = name || input;

    if (output) {
      // 子目录分页：如 essays/page-2.md
      const pageMatch = pageData.relativePath.match(new RegExp(`^${output}/page-(\\d+)\\.md$`));
      if (pageMatch) {
        const pageNum = pageMatch[1];
        if (pageNum === '1') {
          pageData.title = folderName;
        } else {
          pageData.title = isZh ? `${folderName} - 第${pageNum}页` : `${folderName} - Page ${pageNum}`;
        }
        return;
      }

      // 子目录首页：如 essays/index.md
      if (pageData.relativePath === `${output}/index.md`) {
        pageData.title = folderName;
        return;
      }
    } else {
      // 根目录分页：如 page-2.md 或 page-1.md
      const pageMatch = pageData.relativePath.match(/^page-(\d+)\.md$/);
      if (pageMatch) {
        const pageNum = pageMatch[1];
        const folderDisplayName = name && name !== input ? name : isZh ? '文章' : 'Posts';
        if (pageNum === '1') {
          pageData.title = folderDisplayName;
        } else {
          pageData.title = isZh ? `${folderDisplayName} - 第${pageNum}页` : `${folderDisplayName} - Page ${pageNum}`;
        }
        return;
      }
    }
  }
};
