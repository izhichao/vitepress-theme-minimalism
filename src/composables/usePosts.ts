import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import { IPost } from '../types';
import { generatePages } from '../utils/generatePages';
import { generateString } from '../utils/generateString';
import { generateMd } from '../utils/generateMd';
import { removeMdPro } from '../utils/removeMdPro';
import { writeMd } from '../utils/writeMd';
import { formatDate } from '../utils/formatDate';

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
    let tagFlag = false;
    let hiddenPosts: IPost[] = [];
    let posts = await Promise.all(
      paths.map(async (postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

        data.category && (categoryFlag = true);
        data.tags && (tagFlag = true);

        let flag = false;
        if (!data.title) {
          data.title = path.basename(postPath, path.extname(postPath));
          flag = true;
        }

        if (!data.datetime) {
          const stats = await fs.stat(postPath);
          data.datetime = formatDate(stats.birthtime);
          flag = true;
        }

        if (!data.permalink) {
          data.permalink = `/${srcDir}/${generateString(6)}`;
          flag = true;
        }

        // avoid null / undefined
        if (data.tags) {
          data.tags.forEach((tag, index) => {
            data.tags[index] = tag + '';
          });
        }

        // writeMarkdown
        flag && (await writeMd(postPath, content, data));

        // rewrites
        rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${data.permalink}.md`.slice(1).replace(/[+()]/g, '\\$&');

        // excerpt
        const contents = data.desc || removeMdPro(excerpt + '') || removeMdPro(content).slice(0, autoExcerpt);

        return {
          ...data,
          excerpt: contents
        } as IPost;
      })
    );

    // 获取隐藏
    hiddenPosts = posts.filter((post) => post.display === 'none');

    // 排序
    posts = posts
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
    (categoryFlag || tagFlag) && (await generateMd('category', outDir));

    await generatePages(outDir, lang, pageSize, homepage, posts.length, slot, custom);

    return { posts, hiddenPosts, rewrites };
  } catch (e) {
    console.log(e);
    await generatePages();
    return { posts: [], hiddenPosts: [], rewrites };
  }
};
