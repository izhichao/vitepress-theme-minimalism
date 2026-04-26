import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost, IPostsConfig } from '../types';
import { generatePages } from '../utils/generatePages';
import { generateString } from '../utils/generateString';
import { generateCategory } from '../utils/generateCategory';
import { formatDate } from '../utils/formatDate';
import { HeadConfig } from 'vitepress';

// 是否生产环境
const isProd = process.env.NODE_ENV === 'production';

/**
 * 格式化/补全 FrontMatter
 * @param frontMatter FrontMatter 数据
 * @param postPath 文章路径
 * @param srcDir src 路径
 * @returns 是否更改
 */
const formatFrontMatter = async (frontMatter: IPost, postPath: string, srcDir: string) => {
  let changed = false;
  let { id, title, datetime, tags, hidden } = frontMatter;

  if (!id) {
    frontMatter.id = generateString(6);
    changed = true;
  }

  if (!title) {
    frontMatter.title = path.basename(postPath, path.extname(postPath));
    changed = true;
  }

  if (!datetime) {
    const stats = await fs.stat(postPath);
    frontMatter.datetime = formatDate(stats.birthtime);
    changed = true;
  }

  if (tags != null) {
    // 如果不是数组，先包装成数组
    if (!Array.isArray(frontMatter.tags)) {
      frontMatter.tags = [frontMatter.tags];
      changed = true;
    }

    // 遍历每一项，转换为字符串（支持将标签设置为 'null' 'undefined'）
    frontMatter.tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        frontMatter.tags[index] = String(tag);
        changed = true;
      }
    });
  }

  // 隐藏文章时自动添加 noindex meta
  if (hidden) {
    const noindexMeta: HeadConfig = ['meta', { name: 'robots', content: 'noindex, nofollow' }];
    const alreadyExists = (frontMatter.head ?? []).some((item) => Array.isArray(item) && item[1]?.name === 'robots');
    if (!alreadyExists) {
      frontMatter.head = [...(frontMatter.head ?? []), noindexMeta];
      changed = true;
    }
  }
  return changed;
};

/**
 * FrontMatter 回写 Markdown
 * @param path Markdown 路径
 * @param content 文章内容
 * @param frontMatter FrontMatter 数据
 */
const writeMd = async (path: string, content: string, frontMatter: { [key: string]: any }) => {
  const matters = [
    'draft',
    'hidden',
    'order',
    'pinned',
    'password',
    'id',
    'title',
    'datetime',
    'permalink',
    'outline',
    'excerpt',
    'category',
    'tags',
    'prev',
    'next',
    'head'
  ];
  const newMarkdown = matter.stringify(content, frontMatter, {
    // @ts-ignore
    sortKeys: (a: string, b: string) => matters.indexOf(a) - matters.indexOf(b)
  });
  await fs.writeFile(path, newMarkdown, 'utf8');
};

/**
 * 移除 Markdown 语法，保留纯文本（适用于生成摘要）
 * @param str Markdown 原文
 * @returns 纯文本
 */
const removeMdPro = (str: string) => {
  return removeMd(
    str
      .replace(/```.*?```/gs, '')
      .replace(/^#+\s.*$/gm, '')
      .replace(/^>.*$/gm, '')
  ) // 移除代码块、标题、引用
    .trim() // 移除空格
    .split(/\r\n|\n|\r/)
    .join(' ') // 移除换行
    .replace(/\s{2,}/g, ' ')
    .replace(/:::.*?:::/gs, '') // 移除 :::
    .trim();
};

/**
 * 更新单篇文章的上一篇 / 下一篇 FrontMatter
 * @param frontMatter 文章的 FrontMatter 数据
 * @param posts 已排序的可见文章列表
 * @param nav 是否启用上一篇/下一篇
 * @returns 是否发生变更
 */
const updateNav = (frontMatter: IPost, posts: IPost[], nav: boolean): boolean => {
  // nav 关闭、置顶、隐藏或草稿文章：清除已有的 prev / next
  if (!nav || frontMatter.hidden || frontMatter.draft) {
    const hadNav = !!(frontMatter.prev || frontMatter.next);
    delete frontMatter.prev;
    delete frontMatter.next;
    return hadNav;
  }

  // nav 开启时，根据相邻文章更新
  const index = posts.findIndex((post) => post.permalink === frontMatter.permalink);
  const prevPost = posts[index - 1];
  const nextPost = posts[index + 1];
  let changed = false;

  // 设置或更新 prev
  if (prevPost) {
    if (!frontMatter.prev || frontMatter.prev.text !== prevPost.title || frontMatter.prev.link !== prevPost.permalink) {
      frontMatter.prev = { text: prevPost.title, link: prevPost.permalink };
      changed = true;
    }
  } else if (frontMatter.prev) {
    delete frontMatter.prev;
    changed = true;
  }

  // 设置或更新 next
  if (nextPost) {
    if (!frontMatter.next || frontMatter.next.text !== nextPost.title || frontMatter.next.link !== nextPost.permalink) {
      frontMatter.next = { text: nextPost.title, link: nextPost.permalink };
      changed = true;
    }
  } else if (frontMatter.next) {
    delete frontMatter.next;
    changed = true;
  }

  return changed;
};

const defaultConfig: Required<IPostsConfig> = {
  pageSize: 10,
  homepage: true,
  srcDir: 'posts',
  outDir: '',
  lang: 'zh',
  excerpt: 0,
  permalink: 'posts',
  nav: false,
  slot: '',
  custom: '',
  postCount: 0
};

export const usePosts = async (userConfig: IPostsConfig = {}) => {
  // 合并配置，解构 usePosts 所需的配置项
  const config = { ...defaultConfig, ...userConfig };
  const { srcDir, outDir, nav } = config;
  const rewrites = {};
  try {
    const paths = await fg(`${srcDir}/**/*.md`);
    let categoryFlag = false;

    // 缓存每篇文章的原始 frontMatter 和 content，供后续 prev/next 处理复用，避免二次 matter.read
    const postCache = new Map<string, { frontMatter: IPost; content: string; changed: boolean }>();
    const descriptionMap = new Map<string, string>();

    // 一、原始文章列表（包含隐藏文章）
    const results: IPost[] = await Promise.all(
      paths.map(async (postPath) => {
        const {
          data,
          excerpt: _excerpt,
          content
        } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!--more-->'
        });
        const frontMatter = data as IPost;

        const { category, tags, description, draft, id, permalink: _permalink } = frontMatter;

        // 1. 检测是否存在分类/标签，生成分类页面（暂不启用）
        // if (!categoryFlag && (category || tags)) {
        //   categoryFlag = true;
        //   await generateCategory(outDir);
        // }

        // 2. 格式化/补全 FrontMatter 并缓存到 postCache（目前只记录更改，先不写入，等 prev/next 一并处理）
        const changed = await formatFrontMatter(frontMatter, postPath, srcDir);
        postCache.set(postPath, { frontMatter, content, changed });

        // 3. 处理文章摘要 excerpt (自定义摘要 -> 手动摘要 -> 按字数自动摘要)
        const excerpt = description || removeMdPro(_excerpt + '') || removeMdPro(content).slice(0, config.excerpt);
        descriptionMap.set(id, excerpt);

        // 4. 处理永久链接 permalink (自定义链接 -> 按 ID 生成链接 -> 按路径生成链接)
        let permalink: string = postPath.replace(/\.md$/, '');

        if (!draft) {
          if (_permalink) {
            permalink = _permalink;
          } else if (config.permalink) {
            permalink = `${config.permalink}/${id}`;
          }
        }

        // 判断是否需要重写路由
        if (permalink !== postPath.replace(/\.md$/, '')) {
          // rewrites 中统一去除开头的 /
          rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${permalink}.md`.replace(/^\//, '').replace(/[+()]/g, '\\$&');
        }

        // permalink 统一加上开头的 / (必须放后面，否则会影响 rewrites 的 if 判断)
        permalink = permalink.replace(/^\/?/, '/');

        return {
          ...frontMatter,
          permalink,
          excerpt
        } as IPost;
      })
    );

    // 二、隐藏列表 (用于 sitemap 中排除隐藏文章) / 草稿列表 (用于 srcExclude 中排除构建)
    const hiddenPosts = new Set(results.filter((post) => post.hidden).map((post) => post.permalink.replace(/^\//, '')));
    const excludePosts = paths.filter((postPath) => postCache.get(postPath).frontMatter.draft);

    // 三、实际文章列表（按置顶 + 时间排序）
    // 开发环境：不过滤直接排序
    // 生产环境：过滤隐藏文章和草稿
    const posts = (isProd ? results.filter((post) => !post.hidden && !post.draft) : results).sort((a, b) => {
      // 优先按置顶排序
      if (a.order && b.order) return a.order - b.order;
      if (a.order) return -1;
      if (b.order) return 1;
      // 再按时间降序
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    });

    // 四、上一篇 / 下一篇
    await Promise.all(
      paths.map(async (postPath) => {
        const { frontMatter, content, changed } = postCache.get(postPath)!;
        const navChanged = updateNav(frontMatter, posts, nav);
        if (changed || navChanged) await writeMd(postPath, content, frontMatter);
      })
    );

    // 统计文章总数（不含隐藏文章）
    config.postCount = posts.length;

    return { posts, hiddenPosts, excludePosts, rewrites, descriptionMap };
  } catch (e) {
    console.error(e);
    return { posts: [], hiddenPosts: new Set<string>(), excludePosts: [], rewrites, descriptionMap: new Map<string, string>() };
  } finally {
    // 五、最终生成分页（首页与文章列表）
    await generatePages(config);
  }
};
