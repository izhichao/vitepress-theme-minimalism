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
  index = true,
  srcDir = 'posts',
  outDir = '',
  lang = 'zh',
  autoExcerpt = 0,
  prev = true,
  next = true
}) => {
  const rewrites = {};
  try {
    const paths = await fg(`${srcDir}/**/*.md`);
    let categoryFlag = false;
    let tagFlag = false;
    const posts = await Promise.all(
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
        const contents = data.description || removeMdPro(excerpt + '') || removeMdPro(content).slice(0, autoExcerpt);

        return {
          ...data,
          excerpt: contents
        } as IPost;
      })
    );

    // sort posts by datetime
    posts.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      const timeDiff = new Date(b.datetime).getTime() - new Date(a.datetime).getTime();

      return timeDiff;
    });

    // prev / next
    paths.map(async (postPath) => {
      const { data, content } = matter.read(postPath);

      // remove pinned posts prev / next
      if (data.pinned) {
        if (data.prev || data.next) {
          delete data.prev;
          delete data.next;
          await writeMd(postPath, content, data);
          return;
        } else {
          return;
        }
      }

      let postIndex = 0;
      for (let index in posts) {
        if (posts[index].permalink === data.permalink) {
          postIndex = +index;
        }
      }

      let flag = true;
      const prevPost = posts[postIndex - 1];
      const prevDiff = data?.prev?.text !== prevPost?.title || data?.prev?.link !== prevPost?.permalink;
      const nextPost = posts[postIndex + 1];
      const nextDiff = data?.next?.text !== nextPost?.title || data?.next?.link !== nextPost?.permalink;

      if (prev && prevPost && prevDiff && !prevPost.pinned) {
        data.prev = { text: prevPost.title, link: prevPost.permalink };
        flag = true;
      } else if (!prev || !prevPost || prevPost.pinned) {
        delete data.prev;
        flag = true;
      }

      if (next && nextPost && nextDiff) {
        data.next = { text: nextPost.title, link: nextPost.permalink };
        flag = true;
      } else if (!next || !nextPost) {
        delete data.next;
        flag = true;
      }

      flag && (await writeMd(postPath, content, data));
    });

    tagFlag && (await generateMd('tags', outDir, lang));
    categoryFlag && (await generateMd('category', outDir, lang));

    await generatePages(outDir, lang, pageSize, index, paths.length);

    return { posts, rewrites };
  } catch (e) {
    console.log(e);
    await generatePages();
    return { posts: [], rewrites };
  }
};
