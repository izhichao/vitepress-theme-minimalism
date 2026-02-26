import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './fileExists';
import { IPostsConfig } from '../types';

export const generatePages = async (config: Required<IPostsConfig>) => {
  const { outDir, lang, pageSize, homepage, postCount, slot, custom } = config;
  const indexPath = path.resolve(outDir, 'index.md');

  const indexExist = await fileExists(indexPath);
  const pageCount = postCount > 0 ? Math.ceil(postCount / pageSize) : 0;

  for (let i = 1; i <= pageCount; i++) {
    const title = i === 1 && homepage ? '' : lang === 'zh' ? `\ntitle: 第${i}页` : `\ntitle: Page ${i}`;
    const page = `
---${title}
layout: page
---

<Page :pagination="${i}" :total="${pageCount}" :size="${pageSize}" :homepage="${homepage}">${slot}</Page>
${custom}
`.trim();
    const pagePath = i === 1 && homepage ? indexPath : path.resolve(outDir, `page-${i}.md`);
    await fs.writeFile(pagePath, page);
  }

  if ((postCount === 0 || !homepage) && !indexExist) {
    const page = `
---
layout: page
---
<Home imgUrl="/profile.png" title="只抄" desc="Less is more." :links="[{ url: 'https://github.com/izhichao/vitepress-theme-minimalism', text: 'Github ->' }]" />
    `.trim();
    await fs.writeFile(indexPath, page);
  }
};
