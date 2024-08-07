<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <AdItem
        v-if="ads?.docBefore || adsense?.docBefore"
        :ads="ads?.docBefore"
        :adsense="{ client: adsense?.client, slot: adsense?.docBefore }"
        type="doc"
      />

      <template v-if="posts">
        <PostList :posts="posts" />
        <Pagination :pagination="pagination" :total="total" :homepage="homepage" />
      </template>

      <AdItem
        v-if="ads?.docAfter || adsense?.docAfter"
        :ads="ads?.docAfter"
        :adsense="{ client: adsense?.client, slot: adsense?.docAfter }"
        type="doc"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import AdItem from '../components/AdItem.vue';
import PostList from '../components/PostList.vue';
import Pagination from '../components/Pagination.vue';
import type { IPost } from '../types';
import { useAds } from '../composables/useAds';

const props = defineProps({
  pagination: { type: Number, required: true },
  total: { type: Number, required: true },
  size: { type: Number, required: true },
  homepage: Boolean
});

const { ads, adsense } = useAds();
const { theme } = useData();
const posts: IPost[] = (theme.value.posts ? [...theme.value.posts] : [])
  .sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    } else {
      return 0;
    }
  })
  .slice(props.size * (props.pagination - 1), props.size * props.pagination);
</script>

<style lang="less" scoped>
@import '../styles/page.less';
</style>
