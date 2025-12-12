import type { IPost, IPostObject } from '../types';

export const useGroup = (posts: IPost[]) => {
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });

  const groupPosts = {
    category: {},
    tag: {},
    archive: {}
  };

  const tabs = {
    category: [],
    tag: [],
    archive: []
  };

  sortedPosts.forEach((post) => {
    const category = post.category;
    const tags = post.tags;
    const year = new Date(post.datetime).getFullYear();

    addToData(groupPosts.category, category, post);
    tags && tags.forEach((tag) => addToData(groupPosts.tag, tag, post));
    addToData(groupPosts.archive, year, post);
  });

  tabs.category = Object.keys(groupPosts.category).sort((a, b) => a.localeCompare(b));
  tabs.tag = Object.keys(groupPosts.tag).sort((a, b) => a.localeCompare(b));
  tabs.archive = Object.keys(groupPosts.archive).sort((a, b) => parseInt(b) - parseInt(a));

  return { tabs, posts: groupPosts };
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
