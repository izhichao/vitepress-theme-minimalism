import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost } from '../types';

export const getPosts = async ({
  pageSize = 10,
  index = true,
  folder = 'posts',
  autoExcerpt = 0,
  prev = false,
  next = false
}) => {
  const rewrites = {};
  try {
    const paths = await fg(`${folder}/**/*.md`);
    const posts = await Promise.all(
      paths.map(async (postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

        // excerpt
        const contents = data.description || removeMdPro(excerpt) || removeMdPro(content).slice(0, autoExcerpt);

        return {
          ...data,
          excerpt: contents
        } as IPost;
      })
    );

    // date sort
    posts.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      const timeDiff = new Date(b.datetime).getTime() - new Date(a.datetime).getTime();

      return timeDiff;
    });

    // frontMatter
    paths.map(async (postPath) => {
      const { data, content } = matter.read(postPath);

      let postIndex = 0;
      for (let index in posts) {
        if (posts[index].permalink === data.permalink) {
          postIndex = +index;
        }
      }

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
        data.permalink = `/${folder}/${generateRandomString(6)}`;
        flag = true;
      }

      const prevPost = posts[postIndex - 1];
      const prevDiff = data?.prev?.text !== prevPost?.title || data?.prev?.link !== prevPost?.permalink;
      const nextPost = posts[postIndex + 1];
      const nextDiff = data?.next?.text !== nextPost?.title || data?.next?.link !== nextPost?.permalink;

      if (prev && prevPost && prevDiff) {
        data.prev = { text: prevPost.title, link: prevPost.permalink };
        flag = true;
      } else if (!prevPost) {
        delete data.prev;
        flag = true;
      }

      if (next && nextPost && nextDiff) {
        data.next = { text: nextPost.title, link: nextPost.permalink };
        flag = true;
      } else if (!nextPost) {
        delete data.next;
        flag = true;
      }

      if (flag) {
        const matters = ['title', 'datetime', 'permalink', 'outline', 'pinned', 'tags', 'prev', 'next'];
        const newMarkdown = matter.stringify(content, data, {
          // @ts-ignore
          sortKeys: (a: string, b: string) => matters.indexOf(a) - matters.indexOf(b)
        });
        await fs.writeFile(postPath, newMarkdown, 'utf8');
      }

      // rewrites
      rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${data.permalink}.md`.slice(1).replace(/[+()]/g, '\\$&');
    });

    await generatePages({ pageSize, index, total: paths.length });

    return { posts, rewrites };
  } catch (e) {
    console.log(e);
    await generatePages({});
    return { posts: [], rewrites };
  }
};

const generatePages = async ({ pageSize = 10, index = true, total = 0 }) => {
  const indexPath = path.resolve('index.md');
  const indexExist = await fileExists(indexPath);
  let pageTotal = Math.ceil(total / pageSize);

  if (total > 0) {
    for (let i = 1; i <= pageTotal; i++) {
      const page = `
---${i === 1 && index ? '' : `\ntitle: 第${i}页`}
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const page = theme.value.page;
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i});
</script>

<Page :posts="posts" :pageConfig="page" :pageCurrent="${i}" :pageTotal="${pageTotal}" :index="${index}" :pageMax="page?.max || 5" :pinned="page?.pinned || '[置顶]'"/>
`.trim();
      const pagePath = i === 1 && index ? indexPath : path.resolve(`page-${i}.md`);
      await fs.writeFile(pagePath, page);
    }
  }

  if ((total === 0 || !index) && !indexExist) {
    const page = `
---
layout: page
---
<Home imgUrl="/profile.png" title="只抄" desc="Less is more." :links="[{ url: 'https://github.com/izhichao/vitepress-theme-minimalism', text: 'Github ->' }]" />
    `.trim();
    await fs.writeFile(indexPath, page);
  }
};

const removeMdPro = (str: string) => {
  return removeMd(str.replace(/```.*?```/gs, ''))
    .trim()
    .split(/\r\n|\n|\r/)
    .slice(1)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/:::.*?:::/gs, '')
    .trim();
};

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const generateRandomString = (length: number) => {
  const charset = '0123456789abcdef';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomCode += charset[randomIndex];
  }

  return randomCode;
};

const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
