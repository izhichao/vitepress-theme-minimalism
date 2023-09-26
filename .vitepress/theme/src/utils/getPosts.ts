import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost } from '../types';

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const generatePages = async (pageSize: number, total: number = 0, index: boolean = true) => {
  let pageTotal = Math.ceil(total / pageSize);
  const indexPath = path.resolve('index.md');
  const indexExist = await fileExists(indexPath);

  if (total > 0) {
    for (let i = 1; i <= pageTotal; i++) {
      const page = `
---
title: ${i === 1 && index ? '首页' : `第${i}页`}
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pageTotal="${pageTotal}" :index="${index}" />
`.trim();
      const pagePath = i === 1 && index ? indexPath : path.resolve(`page${i}.md`);
      await fs.writeFile(pagePath, page);
    }
  }

  if ((total < 0 || !index) && !indexExist) {
    const page = `
---
layout: page
---
<Home imgUrl="/profile.png" title="只抄" desc="Less is more." :links="[{ url: 'https://github.com/izhichao/vitepress-theme-minimalism', text: 'Github ->' }]" />
    `.trim();
    await fs.writeFile(indexPath, page);
  }
};

export const getPosts = async (pageSize: number, folder: string = 'posts', index: boolean = true) => {
  const rewrites = {};
  try {
    const paths = await fg(`${folder}/**/*.md`);
    const posts = await Promise.all(
      paths.map(async (path) => {
        const { data, excerpt } = matter.read(path, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

        // date
        const date = (data.date ? new Date(data.date) : new Date()).toISOString().split('T')[0];

        // permalink
        if (data.permalink) {
          rewrites[path.replaceAll('+', '\\+')] = `${data.permalink}.md`.replaceAll('+', '\\+');
          path = `/${data.permalink}.html`;
        } else {
          path = path.replace(/\.md$/, '.html');
        }

        // excerpt
        const contents = removeMd(excerpt)
          .trim()
          .split(/\r\n|\n|\r/)
          .slice(1)
          .join('')
          .replace(/\s{2,}/g, '')
          .trim();

        return {
          ...data,
          date,
          excerpt: contents,
          path
        } as IPost;
      })
    );

    // date sort
    posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    await generatePages(pageSize, paths.length, index);

    return { posts, rewrites };
  } catch {
    await generatePages(pageSize);
    return { posts: [], rewrites };
  }
};
