<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <slot name="doc-before"></slot>
      <template v-for="year in years" :key="year">
        <div class="title">{{ year }}</div>
        <PostListLite :posts="yearPosts[year]" />
      </template>
      <slot name="doc-after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import PostListLite from '../components/PostListLite.vue';
import { addToData } from '../utils/addToData';
import { sortPostsByTime } from '../utils/sortPostsByTime';
import type { IPost, IPostObject } from '../types';

const useArchives = (posts: IPost[]) => {
  const yearPosts: IPostObject = {};

  posts.forEach((post) => {
    const year = new Date(post.datetime).getFullYear();
    addToData(yearPosts, year, post);
  });

  const years = Object.keys(yearPosts).sort((a, b) => parseInt(b) - parseInt(a));

  return { years, yearPosts };
};

const { theme } = useData();
// 先按时间排序，再传入归档函数
const sortedPosts = sortPostsByTime(theme.value?.posts || []);
const { years, yearPosts } = useArchives(sortedPosts);
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.25rem;
  padding: 14px 0 8px;
  font-family: var(--font-family-number);
}

.bold {
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .bold {
    font-size: 1.5rem;
  }
}
</style>
