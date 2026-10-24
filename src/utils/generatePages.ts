import fs from 'fs/promises';
import path from 'path';
import type { NormalizedFolder } from './normalizeFolder.ts';

export interface GeneratePageOptions {
  lang?: string;
  slot?: string;
  custom?: string;
}

/**
 * 为单个文章目录生成分页 Markdown 文件
 * @param folder 当前目录的标准化配置
 * @param postCount 当前目录内的可见文章总数
 * @param options 全局页面生成选项（语言、插槽代码、脚本代码等）
 */
export const generateFolderPages = async (
  folder: NormalizedFolder,
  postCount: number,
  options: GeneratePageOptions = {}
): Promise<void> => {
  const { lang = 'zh', slot = '', custom = '' } = options;
  const { output, input, index, pageSize } = folder;

  if (output) {
    await fs.mkdir(output, { recursive: true });
  }

  const indexPath = path.resolve(output, 'index.md');
  const pageCount = postCount > 0 ? Math.ceil(postCount / pageSize) : 0;

  for (let i = 1; i <= pageCount; i++) {
    const title = i === 1 && index ? '' : lang === 'zh' ? `\ntitle: 第${i}页` : `\ntitle: Page ${i}`;
    const page = `
---${title}
layout: page
---

<PageView folder="${input}" :pagination="${i}" :size="${pageSize}" :index="${index}">${slot}</PageView>
${custom}
`.trim();
    const pagePath = i === 1 && index ? indexPath : path.resolve(output, `page-${i}.md`);
    await fs.writeFile(pagePath, page, 'utf8');
  }
};
