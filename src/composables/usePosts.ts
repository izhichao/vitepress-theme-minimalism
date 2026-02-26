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

/**
 * 格式化/补全 FrontMatter
 * @param data FrontMatter 数据
 * @param postPath 文章路径
 * @param srcDir src 路径
 * @returns 是否更改
 */
const formatFrontMatter = async (data, postPath, srcDir) => {
  let changed = false;
  if (!data.title) {
    data.title = path.basename(postPath, path.extname(postPath));
    changed = true;
  }

  if (!data.datetime) {
    const stats = await fs.stat(postPath);
    data.datetime = formatDate(stats.birthtime);
    changed = true;
  }

  if (!data.permalink) {
    data.permalink = `/${srcDir}/${generateString(6)}`;
    changed = true;
  }

  if (data.tags != null) {
    // 如果不是数组，先包装成数组
    if (!Array.isArray(data.tags)) {
      data.tags = [data.tags];
      changed = true;
    }

    // 遍历每一项，转换为字符串（支持将标签设置为 'null' 'undefined'）
    data.tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        data.tags[index] = String(tag);
        changed = true;
      }
    });
  }

  // display: none 时自动添加 noindex meta
  if (data.display === 'none') {
    const noindexMeta = ['meta', { name: 'robots', content: 'noindex, nofollow' }];
    const alreadyExists = (data.head ?? []).some((item) => Array.isArray(item) && item[1]?.name === 'robots');
    if (!alreadyExists) {
      data.head = [...(data.head ?? []), noindexMeta];
      changed = true;
    }
  }
  return changed;
};

/**
 * FrontMatter 回写 Markdown
 * @param path Markdown 路径
 * @param content 文章内容
 * @param data FrontMatter 数据
 */
const writeMd = async (path: string, content: string, data: { [key: string]: any }) => {
  const matters = [
    'title',
    'datetime',
    'permalink',
    'outline',
    'order',
    'pinned',
    'display',
    'desc',
    'category',
    'tags',
    'prev',
    'next',
    'head'
  ];
  const newMarkdown = matter.stringify(content, data, {
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
 * @param prev 是否启用上一篇
 * @param next 是否启用下一篇
 * @returns 是否发生变更
 */
const updateNav = (frontMatter: any, posts: IPost[], prev: boolean, next: boolean): boolean => {
  // 更新单个导航字段（prev 或 next），返回是否发生变更
  const resolveNav = (type: 'prev' | 'next', enabled: boolean, target?: IPost) => {
    if (enabled && target) {
      const outdated =
        !frontMatter[type] || frontMatter[type].text !== target.title || frontMatter[type].link !== target.permalink;
      if (outdated) {
        frontMatter[type] = { text: target.title, link: target.permalink };
        return true;
      }
    } else if (frontMatter[type]) {
      delete frontMatter[type];
      return true;
    }
    return false;
  };

  // 置顶或隐藏文章：清除已有的 prev / next
  if (frontMatter.order || frontMatter.display === 'none') {
    const hadNav = !!(frontMatter.prev || frontMatter.next);
    delete frontMatter.prev;
    delete frontMatter.next;
    return hadNav;
  }

  const index = posts.findIndex((post) => post.permalink === frontMatter.permalink);
  let prevPost: IPost | undefined;
  let nextPost: IPost | undefined;

  // 遍历文章列表，找到前一篇和后一篇文章
  posts.some((post, i) => {
    if (i < index) {
      if (!post.order) prevPost = post; // 当前文章之前，不断覆盖取最近的
    } else if (i > index) {
      if (!post.order && !nextPost) nextPost = post; // 当前文章之后，取第一个
    }
    return !!(prevPost && nextPost); // 前后都找到则停止遍历
  });

  // 两个字段必须分开调用，避免 || 短路跳过 next
  const prevChanged = resolveNav('prev', prev, prevPost);
  const nextChanged = resolveNav('next', next, nextPost);
  return prevChanged || nextChanged;
};

const defaultConfig: Required<IPostsConfig> = {
  pageSize: 10,
  homepage: true,
  srcDir: 'posts',
  outDir: '',
  lang: 'zh',
  autoExcerpt: 0,
  prev: true,
  next: true,
  slot: '',
  custom: '',
  postCount: 0
};

export const usePosts = async (userConfig: IPostsConfig = {}) => {
  // 合并配置，解构 usePosts 所需的配置项
  const config = { ...defaultConfig, ...userConfig };
  const { srcDir, outDir, autoExcerpt, prev, next } = config;
  const rewrites = {};
  try {
    const paths = await fg(`${srcDir}/**/*.md`);
    let categoryFlag = false;

    // 缓存每篇文章的原始 data 和 content，供后续 prev/next 处理复用，避免二次 matter.read
    const postCache = new Map<string, { data: IPost; content: string; changed: boolean }>();

    // 一、原始文章列表（包含隐藏文章）
    const results: IPost[] = await Promise.all(
      paths.map(async (postPath) => {
        const {
          data: _data,
          excerpt: _excerpt,
          content
        } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });
        const data = _data as IPost;

        // 1. 检测是否存在分类/标签，生成分类页面
        if (!categoryFlag && (data.category || data.tags)) {
          categoryFlag = true;
          await generateCategory(outDir);
        }

        // 2. 格式化/补全 FrontMatter 并缓存到 postCache（目前只记录更改，先不写入，等 prev/next 一并处理）
        const changed = await formatFrontMatter(data, postPath, srcDir);
        postCache.set(postPath, { data, content, changed });

        // 3. 通过 rewrites 处理永久链接
        rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${data.permalink}.md`.slice(1).replace(/[+()]/g, '\\$&');

        // 4. 生成文章摘要 excerpt
        const excerpt = data.desc || removeMdPro(_excerpt + '') || removeMdPro(content).slice(0, autoExcerpt);

        return {
          ...data,
          excerpt
        } as IPost;
      })
    );

    // 二、隐藏文章列表（可用于 sitemap 中排除隐藏文章）
    const hiddenPosts = results.filter((post) => post.display === 'none');

    // 三、实际文章列表（过滤掉隐藏文章，并按置顶 + 时间排序）
    const posts = results
      .filter((post) => post.display !== 'none') // 过滤隐藏文章
      .sort((a, b) => {
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
        const { data, content, changed } = postCache.get(postPath)!;
        const navChanged = updateNav(data, posts, prev, next);
        if (changed || navChanged) await writeMd(postPath, content, data);
      })
    );

    // 统计文章总数（不含隐藏文章）
    config.postCount = posts.length;

    return { posts, hiddenPosts, rewrites };
  } catch (e) {
    console.error(e);
    return { posts: [], hiddenPosts: [], rewrites };
  } finally {
    // 五、最终生成分页（首页与文章列表）
    await generatePages(config);
  }
};
