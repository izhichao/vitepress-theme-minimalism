import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import { IPost } from '../types';

export const getPosts = async ({ pageSize = 10, index = true, folder = 'posts', autoExcerpt = 0 }) => {
  const rewrites = {};
  try {
    const paths = await fg(`${folder}/**/*.md`);
    const posts = await Promise.all(
      paths.map(async (postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->'
        });

        // no title/datetime/permalink
        let tag = false;
        if (!data.title || !data.datetime || !data.permalink) {
          tag = true;
        }
        !data.title && (data.title = path.basename(postPath, path.extname(postPath)));
        !data.datetime && (data.datetime = await generateBirthtime(postPath));
        !data.permalink && (data.permalink = `${folder}/${generateRandomString(6)}`);

        // permalink
        rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${data.permalink}.md`.replace(/[+()]/g, '\\$&');

        // excerpt
        const contents = data.description || removeMdPro(excerpt) || removeMdPro(content).slice(0, autoExcerpt);

        if (tag) {
          const matters = ['title', 'datetime', 'permalink', 'outline', 'pinned', 'tags'];
          const newMarkdown = matter.stringify(content, data, {
            // @ts-ignore
            sortKeys: (a: string, b: string) => matters.indexOf(a) - matters.indexOf(b)
          });
          await fs.writeFile(postPath, newMarkdown, 'utf8');
        }

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

const generateBirthtime = async (path: string) => {
  const stats = await fs.stat(path);

  let ISOString = stats.birthtime.toISOString().split('T');
  const date = ISOString[0];
  const time = ISOString[1].split('.')[0];

  return `${date} ${time}`;
};
