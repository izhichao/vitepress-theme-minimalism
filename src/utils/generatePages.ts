import fs from 'fs/promises';
import path from 'path';
import type { NormalizedFolder } from './normalizeFolder.ts';

/**
 * 为单个文章目录生成分页 Markdown 文件
 * @param folder 当前目录的标准化配置
 * @param postCount 当前目录内的可见文章总数
 */
export const generateFolderPages = async (
  folder: NormalizedFolder,
  postCount: number
): Promise<void> => {
  const { output, input, index, pageSize } = folder;

  if (output) {
    await fs.mkdir(output, { recursive: true });
  }

  const indexPath = path.resolve(output, 'index.md');
  const pageCount = postCount > 0 ? Math.ceil(postCount / pageSize) : 0;

  for (let i = 1; i <= pageCount; i++) {
    const page = `
---
layout: page
---

<PageView folder="${input}" :pagination="${i}" :size="${pageSize}" :index="${index}" />
`.trim();
    const pagePath = i === 1 && index ? indexPath : path.resolve(output, `page-${i}.md`);
    await fs.writeFile(pagePath, page, 'utf8');
  }
};
