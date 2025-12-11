import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './fileExists';

export const generateMd = async (type: string, outDir: string) => {
  const filePath = path.resolve(outDir, `${type}.md`);
  if (await fileExists(filePath)) return;

  const titles = {
    archives: '归档',
    category: '分类'
  };

  const page = `
---
title: ${titles[type]}
layout: page
---

<Archives />
    `.trim();
  await fs.writeFile(filePath, page);
};
