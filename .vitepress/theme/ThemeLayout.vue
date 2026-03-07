<template>
  <!-- 未解锁：只渲染密码组件，文章内容不进 DOM -->
  <Password v-if="!verified" />

  <!-- 已解锁：正常渲染 -->
  <Layout v-else>
    <template #aside-outline-before>
      <ShareItem />
    </template>
    <template #doc-footer-before>
      <Copyright />
    </template>
    <template #doc-after>
      <PrevNext />
      <AdItem :custom="ads" type="doc" />
      <AdItem :adsense="adsense" type="doc" />
      <CommentItem />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme';
import type { IAdsense } from '../../src/types.ts';
import PrevNext from '../../src/components/PrevNext.vue';
import Copyright from '../../src/components/Copyright.vue';
import Password from '../../src/components/Password.vue';
import AdItem from '../../src/components/AdItem.vue';
import ShareItem from '../../src/components/ShareItem.vue';
import CommentItem from './components/CommentItem.vue';
import { usePassword } from '../../src/composables/usePassword.ts';
import { ads } from './ads.ts';

const adsense: IAdsense = {
  client: 'XXXX',
  slot: 'XXXX'
};
const { Layout } = DefaultTheme;
const { verified } = usePassword();
</script>
