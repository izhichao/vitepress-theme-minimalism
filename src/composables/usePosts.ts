import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost } from '../types';
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

export const usePosts = async ({
  pageSize = 10,
  homepage = true,
  srcDir = 'posts',
  outDir = '',
  lang = 'zh',
  autoExcerpt = 0,
  prev = true,
  next = true,
  slot = '',
  custom = ''
}) => {
  const rewrites = {};
  try {
    const paths = await fg(`${srcDir}/**/*.md`);
    let categoryFlag = false;

    // 原始文章列表（包含隐藏文章）
    const results: IPost[] = (await Promise.all(
      paths.map(async (postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

       !categoryFlag && (data.category || data.tags) && (categoryFlag = true);

        // 格式化/补全 FrontMatter，并回写 Markdown（如果有变更）
        const changed = formatFrontMatter(data, postPath, srcDir);
        changed && (await writeMd(postPath, content, data));

        // 永久链接 rewrites
        rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${data.permalink}.md`.slice(1).replace(/[+()]/g, '\\$&');

        // 文章摘要 excerpt
        const contents = data.desc || removeMdPro(excerpt + '') || removeMdPro(content).slice(0, autoExcerpt);

        return {
          ...data,
          excerpt: contents
        } as IPost;
      })
    ));

    // 隐藏文章列表（可用于 sitemap 中排除隐藏文章）
    const hiddenPosts = results.filter((post) => post.display === 'none');

    // 实际文章列表（过滤掉隐藏文章，并按置顶 + 时间排序）
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

    // 上一篇 / 下一篇
    paths.map(async (postPath) => {
      const { data, content } = matter.read(postPath);

      const isHidden = data.display === 'none';
      const isPinned = !!data.order;

      // 如果是置顶或隐藏文章，清除 prev / next 后跳过处理
      if (isPinned || isHidden) {
        if (data.prev || data.next) {
          delete data.prev;
          delete data.next;
          await writeMd(postPath, content, data);
        }
        return;
      }

      const index = posts.findIndex((post) => post.permalink === data.permalink);

      // 向前查找：不是置顶的文章
      const prevPost = posts
        .slice(0, index)
        .reverse()
        .find((post) => !post.order);
      // 向后查找：不是置顶也不是隐藏的文章
      const nextPost = posts.slice(index + 1).find((post) => !post.order);

      let updated = false;

      if (prev && prevPost) {
        const changed = !data.prev || data.prev.text !== prevPost.title || data.prev.link !== prevPost.permalink;
        if (changed) {
          data.prev = { text: prevPost.title, link: prevPost.permalink };
          updated = true;
        }
      } else if (data.prev) {
        delete data.prev;
        updated = true;
      }

      if (next && nextPost) {
        const changed = !data.next || data.next.text !== nextPost.title || data.next.link !== nextPost.permalink;
        if (changed) {
          data.next = { text: nextPost.title, link: nextPost.permalink };
          updated = true;
        }
      } else if (data.next) {
        delete data.next;
        updated = true;
      }

      if (updated) {
        await writeMd(postPath, content, data);
      }
    });

    // 生成分类页面
    categoryFlag && (await generateCategory(outDir));

    await generatePages(outDir, lang, pageSize, homepage, posts.length, slot, custom);

    return { posts, hiddenPosts, rewrites };
  } catch (e) {
    console.error(e);
    await generatePages();
    return { posts: [], hiddenPosts: [], rewrites };
  }
};
