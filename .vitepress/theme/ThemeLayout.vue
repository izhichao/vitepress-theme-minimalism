<template>
  <Layout>
    <template #doc-after>
      <AdItem :custom="ad" type="doc" />
      <AdItem :adsense="{ client: adsense.client, slot: adsense.slot }" type="doc" />
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
  [
    {
      title: 'V.PS- 美国 CN2 GIA / 9929 / CMIN2 顶级线路',
      img: 'https://minio.zhichao.org/assets/vps.png',
      link: 'https://link.zhichao.org/vps'
    },
    {
      title: '搬瓦工 - 美国 CN2 优化线路',
      img: 'https://minio.zhichao.org/assets/bwh.png',
      link: 'https://link.zhichao.org/bwh'
    },
    {
      title: 'RackNerd - 美国 163 直连线路',
      img: 'https://minio.zhichao.org/assets/rn.png',
      link: 'https://link.zhichao.org/rn'
    }
  ]
];

const adsense: IAdsense = {
  client: 'XXXX',
  slot: 'XXXX'
};
const { Layout } = DefaultTheme;
</script>
