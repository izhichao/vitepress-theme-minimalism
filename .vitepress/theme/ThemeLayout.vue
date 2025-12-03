<template>
  <Layout>
    <template #aside-outline-before>
      <ShareItem />
    </template>
    <template #doc-after>
      <AdItem :custom="ads" type="doc" />
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
import ShareItem from '../../src/components/ShareItem.vue';
import CommentItem from './components/CommentItem.vue';
import type { IAdsense } from '../../src/types.ts';
import { ads } from '../../src/ads.ts';

const adsense: IAdsense = {
  client: 'XXXX',
  slot: 'XXXX'
};
const { Layout } = DefaultTheme;
</script>
