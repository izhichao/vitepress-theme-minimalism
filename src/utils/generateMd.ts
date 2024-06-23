import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './fileExists';

export const generateMd = async (type: string) => {
  const filePath = path.resolve(`${type.toLowerCase()}.md`);
  if (await fileExists(filePath)) return;

  const page = `
---
title: ${type}
layout: page
---

<Group type='${type.toLowerCase()}' />
    `.trim();
  await fs.writeFile(path.resolve(filePath), page);
};
