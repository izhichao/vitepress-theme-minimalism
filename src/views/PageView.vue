<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <slot name="doc-before"></slot>
      <template v-if="posts">
        <PostList :posts="posts" />
        <Pagination :pagination="pagination" :total="total" :homepage="homepage" />
      </template>
      <slot name="doc-after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import PostList from '../components/PostList.vue';
import Pagination from '../components/Pagination.vue';
import type { IPost } from '../types';

const props = defineProps({
  pagination: { type: Number, required: true },
  total: { type: Number, required: true },
  size: { type: Number, required: true },
  homepage: Boolean
});

const { theme } = useData();
const posts: IPost[] = (theme.value.posts ? [...theme.value.posts] : []).slice(
  props.size * (props.pagination - 1),
  props.size * props.pagination
);
</script>

<style lang="less" scoped>
@import '../styles/page.less';
</style>
