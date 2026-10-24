<template>
  <div class="ZCContainer">
    <div class="ZCLayout">
      <div class="ZCContent">
        <slot name="doc-before"></slot>
        <template v-if="posts">
          <PostList :posts="posts" />
          <Pagination :pagination="pagination" :total="total" :index="index" :basePath="basePath" />
        </template>
        <slot name="doc-after"></slot>
      </div>
      <aside class="ZCAside ZCAside--left">
        <slot name="aside-left"></slot>
      </aside>
      <aside class="ZCAside ZCAside--right">
        <slot name="aside-right"></slot>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import PostList from '../components/PostList.vue';
import Pagination from '../components/Pagination.vue';
import type { IPost } from '../types';

const props = defineProps({
  pagination: { type: Number, required: true },
  size: { type: Number, default: 10 },
  index: { type: Boolean, default: true },
  folder: { type: String, default: '' }
});

const { theme, page } = useData();

// 依据当前页面文件相对路径自动推导路由前缀（例如 'essays/index.md' -> '/essays'，根目录 -> ''）
const basePath = computed(() => {
  const rel = page.value?.relativePath || '';
  return rel.includes('/') ? '/' + rel.slice(0, rel.lastIndexOf('/')) : '';
});

// 根据 folder 属性过滤所属目录的文章列表：
// 1. 首页列表（basePath 为空）：包含首页自身目录文章 + 全站所有标记了 order 的置顶文章 + 标记了 index: true 的跨目录文章
// 2. 子板块列表（basePath 不为空）：仅包含当前板块自身文章
const folderPosts = computed(() => {
  const allPosts: IPost[] = theme.value.posts || [];
  const isRoot = basePath.value === '';

  if (isRoot) {
    const targetFolder = props.folder || allPosts[0]?.folder;
    return allPosts.filter(
      (post) =>
        (targetFolder ? post.folder === targetFolder : true) ||
        Boolean(post.order) ||
        Boolean(post.index)
    );
  }
  return allPosts.filter((post) => post.folder === props.folder);
});

// 动态计算总页数，自适应文章增减
const total = computed(() => {
  const count = folderPosts.value.length;
  return count > 0 ? Math.ceil(count / props.size) : 0;
});

const posts = computed(() => {
  return folderPosts.value.slice(props.size * (props.pagination - 1), props.size * props.pagination);
});
</script>

<style lang="less" scoped>
@import '../styles/page.less';
</style>
