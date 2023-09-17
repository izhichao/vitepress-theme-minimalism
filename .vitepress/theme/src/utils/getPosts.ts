import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { IPost } from '../types';

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const generatePages = async (pageSize: number, total: number = 0) => {
  let pageTotal = Math.ceil(total / pageSize);
  const indexPath = path.resolve('index.md');
  const index = await fileExists(indexPath);

  if (total > 0) {
    for (let i = 1; i <= pageTotal; i++) {
      const page = `
---
title: ${i === 1 ? '首页' : `第${i}页`}
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pageTotal="${pageTotal}" />
`.trim();
      const pagePath = i === 1 ? indexPath : path.resolve(`page${i}.md`);
      await fs.writeFile(pagePath, page);
    }
  } else if (!index) {
    const page = `
---
layout: page
---
<Home imgUrl="/profile.png" title="只抄" desc="Less is more." :links="[{ url: 'https://memo.zhichao.org/', text: 'Github ->' }]" />
    `.trim();
    await fs.writeFile(indexPath, page);
  }
};

/**
 * getPosts
 * @param pageSize number of posts per page
 * @param folder posts folder --default='posts'
 * @returns
 */
export const getPosts = async (pageSize: number, folder: string = 'posts') => {
  const rewrites = {};
  try {
    const paths = await fs.readdir(folder);
    const mdPaths = paths
      .filter((item) => {
        return path.extname(item) === '.md';
      })
      .map((item) => {
        return `${folder}/${item}`;
      });

    await generatePages(pageSize, paths.length);

    const posts = await Promise.all(
      mdPaths.map(async (path) => {
        const { data } = matter.read(path);

        // date
        const date = (data.date ? new Date(data.date) : new Date()).toISOString().split('T')[0];

        // permalink
        if (data.permalink) {
          rewrites[path.replaceAll('+', '\\+')] = `${data.permalink}.md`.replaceAll('+', '\\+');
          path = `/${data.permalink}.html`;
        } else {
          path = path.replace(/\.md$/, '.html');
        }

        return {
          ...data,
          date,
          path
        } as IPost;
      })
    );

    // date sort
    posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return { posts, rewrites };
  } catch {
    await generatePages(pageSize);
    return { posts: [], rewrites };
  }
};
