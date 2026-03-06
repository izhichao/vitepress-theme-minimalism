<template>
  <!-- 未解锁：只渲染密码组件，文章内容不进 DOM -->
  <Password v-if="!verified" @verified="verified = true" />

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
import { onMounted, ref, watch } from 'vue';
import { useData, inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import type { IAdsense } from '../../src/types.ts';
import PrevNext from '../../src/components/PrevNext.vue';
import Copyright from '../../src/components/Copyright.vue';
import Password from '../../src/components/Password.vue';
import AdItem from '../../src/components/AdItem.vue';
import ShareItem from '../../src/components/ShareItem.vue';
import CommentItem from './components/CommentItem.vue';
import { ads } from './ads.ts';

const adsense: IAdsense = {
  client: 'XXXX',
  slot: 'XXXX'
};
const { Layout } = DefaultTheme;
const { frontmatter } = useData();

const verified = ref(true);

function checkPassword() {
  const pwd = String(frontmatter.value?.password ?? '');
  // 无密码时，直接 return
  if (!pwd) {
    verified.value = true;
    return;
  }
  // 有密码时检查 localStorage 是否已验证
  if (!inBrowser) {
    verified.value = false;
    return;
  }
  const id = frontmatter.value?.id || '';
  const stored = JSON.parse(localStorage.getItem('post_passwords') || '{}');
  // 存储密码不正确时，开启密码验证
  verified.value = stored[id] === pwd;
}

// 每次路由切换检查是否需要密码
watch(
  () => frontmatter.value?.id,
  () => {
    checkPassword();
  }
);

onMounted(() => {
  checkPassword();
});
</script>
