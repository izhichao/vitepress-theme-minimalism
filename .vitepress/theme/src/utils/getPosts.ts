import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost } from '../types';

export const getPosts = async (pageSize = 10, folder = 'posts', index = true) => {
  const rewrites = {};
  try {
    const paths = await fg(`${folder}/**/*.md`);
    const posts = await Promise.all(
      paths.map(async (postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

        // no title/date/permalink/outline
        let tag = false;
        if (!data.title || !data.date || !data.permalink || !data.outline) {
          tag = true;
        }
        !data.title && (data.title = path.basename(postPath, path.extname(postPath)));
        !data.datetime && (data.datetime = await generateBirthtime(postPath));
        !data.outline && (data.outline = 'deep');
        !data.permalink && (data.permalink = 'posts/' + generateRandomString(6));

        // date
        let ISOString = new Date(data.datetime).toISOString().split('T');
        const date = ISOString[0];
        const time = ISOString[1].split('.')[0];

        // permalink
        rewrites[postPath.replaceAll('+', '\\+')] = `${data.permalink}.md`.replaceAll('+', '\\+');
        const permalink = `/${data.permalink}.html`;

        // excerpt
        const contents = removeMd(excerpt)
          .trim()
          .split(/\r\n|\n|\r/)
          .slice(1)
          .join('')
          .replace(/\s{2,}/g, '')
          .trim();

        if (tag) {
          const matters = ['title', 'datetime', 'permalink', 'outline', 'tags'];
          const newMarkdown = matter.stringify(content, data, {
            // @ts-ignore
            sortKeys: (a: string, b: string) => matters.indexOf(a) - matters.indexOf(b)
          });
          await fs.writeFile(postPath, newMarkdown, 'utf8');
        }

        return {
          ...data,
          date,
          time,
          excerpt: contents,
          path: permalink
        } as IPost;
      })
    );

    // date sort
    posts.sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    });

    await generatePages(pageSize, paths.length, index);

    return { posts, rewrites };
  } catch (e) {
    console.log(e);
    await generatePages(pageSize);
    return { posts: [], rewrites };
  }
};

const generatePages = async (pageSize: number, total = 0, index = true) => {
  let pageTotal = Math.ceil(total / pageSize);
  const indexPath = path.resolve('index.md');
  const indexExist = await fileExists(indexPath);

  if (total > 0) {
    for (let i = 1; i <= pageTotal; i++) {
      const page = `
---${i === 1 && index ? '' : `\ntitle: 第${i}页`}
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

const generateBirthtime = async (path: string) => {
  const stats = await fs.stat(path);
  const date = new Date(stats.birthtime);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
