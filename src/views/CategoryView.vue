<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <AdItem
        v-if="ads?.docBefore || adsense?.docBefore"
        :ads="ads?.docBefore"
        :adsense="{ client: adsense?.client, slot: adsense?.docBefore }"
        type="doc"
      />
      <div class="title" v-if="category">分类：{{ category }}</div>

      <PostList :posts="posts" />

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
import { ref } from 'vue';
import { useData } from 'vitepress';
import { useAds } from '../composables/useAds';
import type { IPost } from '../types';
import AdItem from '../components/AdItem.vue';
import PostList from '../components/PostList.vue';

const { ads, adsense } = useAds();
const { theme } = useData();
const url = location.href.split('?')[1];
const params = new URLSearchParams(url);
const category = ref(params.get('category') || '');

const posts = theme.value.posts
  .filter((post: IPost) => {
    return post.category === category.value;
  })
  .sort((a: IPost, b: IPost) => {
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;
  text-align: left;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>
