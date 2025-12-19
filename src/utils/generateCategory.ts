import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './fileExists';

export const generateCategory = async (outDir: string) => {
  const filePath = path.resolve(outDir, `category.md`);
  if (await fileExists(filePath)) return;

  const page = `
---
title: 分类
layout: page
---

<Category />
    `.trim();
  await fs.writeFile(filePath, page);
};
