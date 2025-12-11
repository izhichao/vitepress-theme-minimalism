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
import type { IPost, IPostObject } from '../types';

const useArchives = (posts: IPost[]) => {
  const yearPosts: IPostObject = {};

  posts.forEach((post) => {
    const year = new Date(post.datetime).getFullYear();
    addToData(yearPosts, year, post);
  });

  // 对每年的文章按时间倒序排序（最新的在前）
  Object.keys(yearPosts).forEach((year) => {
    yearPosts[year].sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
    });
  });

  const years = Object.keys(yearPosts).sort((a, b) => parseInt(b) - parseInt(a));

  return { years, yearPosts };
};

const { theme } = useData();
const { years, yearPosts } = useArchives(theme.value?.posts);
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
