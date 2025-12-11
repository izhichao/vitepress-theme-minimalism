// 按照 key 将文章添加到对应的对象中

import type { IPost, IPostObject } from '../types';

export const addToData = (obj: IPostObject, key: any, value: IPost) => {
  if (key) {
    if (!obj[key]) {
      obj[key] = [];
    }
    obj[key].push(value);
  }
}