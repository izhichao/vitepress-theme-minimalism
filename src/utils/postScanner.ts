import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import removeMd from 'remove-markdown';
import type { HeadConfig } from 'vitepress';
import type { IPost, IPostsConfig } from '../types.ts';
import type { NormalizedFolder } from './normalizeFolder.ts';
import { generateString } from './generateString.ts';
import { formatDate } from './formatDate.ts';

const matters = [
  'draft',
  'deleted',
  'hidden',
  'order',
  'pinned',
  'index',
  'password',
  'id',
  'title',
  'datetime',
  'permalink',
  'outline',
  'excerpt',
  'category',
  'tags',
  'head'
];

export interface ScanResult {
  allPosts: IPost[];
  descriptionMap: Map<string, string>;
  rewrites: Record<string, string>;
  hiddenPosts: Set<string>;
  excludePosts: string[];
}

/**
 * 将补全后的 FrontMatter（如自动生成的 id、datetime）回写至 Markdown 文件
 * @param filePath Markdown 文件物理路径
 * @param content 文章正文内容
 * @param frontMatter FrontMatter 数据对象
 */
export const writeMd = async (filePath: string, content: string, frontMatter: Record<string, any>): Promise<void> => {
  const { folder: _folder, prev: _prev, next: _next, ...cleanMatter } = frontMatter;
  const newMarkdown = matter.stringify(content, cleanMatter, {
    // @ts-ignore
    sortKeys: (a: string, b: string) => matters.indexOf(a) - matters.indexOf(b)
  });
  await fs.writeFile(filePath, newMarkdown, 'utf8');
};

/**
 * 去除 Markdown 语法标记，保留纯文本用于生成摘要
 * @param str Markdown 原始内容
 */
export const removeMdPro = (str: string): string => {
  return removeMd(
    str
      .replace(/```.*?```/gs, '')
      .replace(/^#+\s.*$/gm, '')
      .replace(/^>.*$/gm, '')
  )
    .trim()
    .split(/\r\n|\n|\r/)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/:::.*?:::/gs, '')
    .trim();
};

/**
 * 校验并补全文章 FrontMatter（生成缺失的 id、title、datetime 等）
 * @param frontMatter FrontMatter 数据对象
 * @param postPath 文章文件路径
 * @returns 是否发生了字段修改
 */
export const formatFrontMatter = async (frontMatter: IPost, postPath: string): Promise<boolean> => {
  let changed = false;
  const { id, title, datetime, tags, hidden } = frontMatter;

  if (!id) {
    frontMatter.id = generateString(6);
    changed = true;
  }

  if (!title) {
    frontMatter.title = path.basename(postPath, path.extname(postPath));
    changed = true;
  }

  if (!datetime) {
    const stats = await fs.stat(postPath);
    frontMatter.datetime = formatDate(stats.birthtime);
    changed = true;
  }

  if (tags != null) {
    if (!Array.isArray(frontMatter.tags)) {
      frontMatter.tags = [frontMatter.tags];
      changed = true;
    }
    frontMatter.tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        frontMatter.tags[index] = String(tag);
        changed = true;
      }
    });
  }

  if (hidden) {
    const noindexMeta: HeadConfig = ['meta', { name: 'robots', content: 'noindex, nofollow' }];
    const alreadyExists = (frontMatter.head ?? []).some((item) => Array.isArray(item) && item[1]?.name === 'robots');
    if (!alreadyExists) {
      frontMatter.head = [...(frontMatter.head ?? []), noindexMeta];
      changed = true;
    }
  }

  return changed;
};

/**
 * 扫描并解析所有配置目录中的 Markdown 文章
 * @param folders 已标准化的文件夹配置列表
 * @param globalConfig 全局配置项（提供默认 excerpt 等）
 */
export const scanAndParsePosts = async (
  folders: NormalizedFolder[],
  globalConfig: IPostsConfig = {}
): Promise<ScanResult> => {
  const allPosts: IPost[] = [];
  const descriptionMap = new Map<string, string>();
  const rewrites: Record<string, string> = {};
  const hiddenPosts = new Set<string>();
  const excludePosts: string[] = [];

  for (const folder of folders) {
    // 扫描该文件夹下的所有 markdown，排除自动生成的分页文件
    const rawPaths = await fg(`${folder.input}/**/*.md`, {
      ignore: [`${folder.input}/index.md`, `${folder.input}/page-[0-9]*.md`]
    });

    await Promise.all(
      rawPaths.map(async (postPath) => {
        const { data, excerpt: rawExcerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!--more-->'
        });
        const frontMatter = data as IPost;

        // 1. 格式化与补全 FrontMatter（如 id、datetime 等）
        const changed = await formatFrontMatter(frontMatter, postPath);
        if (changed) {
          await writeMd(postPath, content, frontMatter);
        }

        // 2. 字段解构（必须放在 formatFrontMatter 之后，确保拿到新生成的 id）
        const { description, draft, deleted, id, permalink: customPermalink } = frontMatter;
        const isDraft = !!(draft || deleted);

        // 3. 生成摘要
        const excerpt =
          description ||
          (frontMatter.password
            ? '🔒 此内容已加密'
            : removeMdPro(rawExcerpt ? String(rawExcerpt) : '') ||
              removeMdPro(content).slice(0, globalConfig.excerpt ?? 0));
        descriptionMap.set(id, excerpt);

        // 4. 计算永久链接与路由重写
        let permalink: string = postPath.replace(/\.md$/, '');
        if (!isDraft) {
          if (customPermalink) {
            permalink = customPermalink;
          } else if (folder.permalink) {
            permalink = `${folder.permalink}/${id}`;
          }
        }

        if (permalink !== postPath.replace(/\.md$/, '')) {
          rewrites[postPath.replace(/[+()]/g, '\\$&')] = `${permalink}.md`.replace(/^\//, '').replace(/[+()]/g, '\\$&');
        }

        permalink = permalink.replace(/^\/?/, '/');
        frontMatter.permalink = permalink;

        const publicPost: IPost = {
          ...frontMatter,
          folder: folder.input,
          permalink,
          excerpt
        };

        if (frontMatter.password) delete publicPost.password;
        if (isDraft) excludePosts.push(postPath);
        if (frontMatter.hidden) hiddenPosts.add(permalink.replace(/^\//, ''));

        allPosts.push(publicPost);
      })
    );
  }

  return {
    allPosts,
    descriptionMap,
    rewrites,
    hiddenPosts,
    excludePosts
  };
};
