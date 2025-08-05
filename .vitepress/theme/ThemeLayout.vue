<template>
  <Layout>
    <template #doc-after>
      <AdItem :custom="ad" type="doc" />
      <AdItem :adsense="adsense" type="doc" />
      <CommentItem />
    </template>
    <template #doc-footer-before>
      <PostInfoItem />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme';
import PostInfoItem from '../../src/components/PostInfoItem.vue';
import AdItem from '../../src/components/AdItem.vue';
import CommentItem from './components/CommentItem.vue';
import type { IAd, IAdsense } from '../../src/types.ts';

const ad: (IAd | IAd[])[] = [
  {
    title: 'RackNerd - 洛杉矶 DC3 直连线路',
    img: 'https://zhichao.org/images/rn.png',
    link: 'https://link.zhichao.org/rn'
  }
];

const adsense: IAdsense = {
  client: 'XXXX',
  slot: 'XXXX'
};
const { Layout } = DefaultTheme;
</script>
