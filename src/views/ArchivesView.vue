<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <AdItem
        v-if="ads?.docBefore || adsense?.docBefore"
        :ads="ads?.docBefore"
        :adsense="{ client: adsense?.client, slot: adsense?.docBefore }"
        type="doc"
      />
      <div v-for="item in posts">
        <div class="archive">{{ item.year }}</div>
        <ul>
          <PostListLite :posts="item.data" />
        </ul>
      </div>
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
import { computed } from 'vue';
import { useAds } from '../composables/useAds';
import type { IPost, ITag, IArchive } from '../types';
import PostListLite from '../components/PostListLite.vue';
import AdItem from '../components/AdItem.vue';

const { ads, adsense } = useAds();
const { theme } = useData();

const groupByYears = (posts: IPost[]) => {
  const data: ITag = {};
  posts.forEach((post) => {
    const year = new Date(post.datetime).getFullYear();
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

const posts = computed(() => groupByYears(theme.value.posts));
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.archive {
  padding: 14px 0 8px;
  font-size: 1.25rem;
  font-family: var(--font-family-number);
}
</style>
