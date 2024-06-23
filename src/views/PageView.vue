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
        <PostList :posts="posts" :pinned="pinned" />
        <Pagination :current="current" :total="props.total" :index="index" :max="page?.max" />
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
import { computed } from 'vue';
import AdItem from '../components/AdItem.vue';
import PostList from '../components/PostList.vue';
import Pagination from '../components/Pagination.vue';
import type { IPost } from '../types';
import { useAds } from '../composables/useAds';

const { ads, adsense } = useAds();
const props = defineProps({
  posts: Array<IPost>,
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  index: Boolean,
  page: Object
});

const pinned = computed(() => (props?.page?.pinned as string) || '[置顶]');
</script>

<style lang="less" scoped>
@import '../styles/page.less';
</style>
