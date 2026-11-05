import type { IPost, IPostObject } from '../types';
import { slugify } from '../utils/slugify.ts';

export const useGroup = (posts: IPost[]) => {
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });

  const groupPosts: {
    category: IPostObject;
    tag: IPostObject;
    archive: IPostObject;
  } = {
    category: {},
    tag: {},
    archive: {}
  };

  const tabs: {
    category: string[];
    tag: string[];
    archive: string[];
  } = {
    category: [],
    tag: [],
    archive: []
  };

  const slugMap = {
    category: new Map<string, string>(),
    tag: new Map<string, string>()
  };

  sortedPosts.forEach((post) => {
    const category = post.category ? String(post.category).trim() : '';
    const tags = post.tags;
    const year = new Date(post.datetime).getFullYear();

    if (category) {
      const slug = slugify(category);
      addToData(groupPosts.category, category, post);
      if (slug && slug !== category) {
        addToData(groupPosts.category, slug, post);
      }
      if (slug && !slugMap.category.has(slug)) {
        slugMap.category.set(slug, category);
      }
    }

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        const rawTag = tag != null ? String(tag).trim() : '';
        if (rawTag) {
          const slug = slugify(rawTag);
          addToData(groupPosts.tag, rawTag, post);
          if (slug && slug !== rawTag) {
            addToData(groupPosts.tag, slug, post);
          }
          if (slug && !slugMap.tag.has(slug)) {
            slugMap.tag.set(slug, rawTag);
          }
        }
      });
    }

    addToData(groupPosts.archive, year, post);
  });

  tabs.category = [...slugMap.category.values()].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  tabs.tag = [...slugMap.tag.values()].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  tabs.archive = Object.keys(groupPosts.archive).sort((a, b) => parseInt(b) - parseInt(a));

  return { tabs, posts: groupPosts, slugMap };
};

// 按照 key 将文章添加到对应的对象中
const addToData = (obj: IPostObject, key: any, value: IPost) => {
  if (key) {
    if (!obj[key]) {
      obj[key] = [];
    }
    obj[key].push(value);
  }
};
