import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './fileExists';

export const generatePages = async ({ pageSize = 10, index = true, total = 0 }) => {
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

<Page :posts="posts" :page="page" :current="${i}" :total="${pageTotal}" :index="${index}" />
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
