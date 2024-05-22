import { IPost, ITag, IArchive } from '../types';

export const groupByTags = (posts: IPost[]) => {
  const data: ITag = {};
  posts.forEach((post) => {
    const tags = post.tags;
    if (tags) {
      tags.forEach((tag) => {
        if (!data[tag]) {
          data[tag] = [];
        }
        data[tag].push(post);
      });
    }
  });

  // sort by datetime
  for (let i in data) {
    data[i].sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    });
  }

  return data;
};

export const groupByYears = (posts: IPost[]) => {
  const data: ITag = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (year) {
      if (!data[year]) {
        data[year] = [];
      }
      data[year].push(post);
    }
  });

  // get years and sort by year
  const years = Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));

  const sortedData: IArchive[] = [];
  years.forEach((year) => {
    sortedData.push({ year, data: data[year] });
  });

  // sort by datetime
  sortedData.forEach((item) => {
    item.data.sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    });
  });
  return sortedData;
};
