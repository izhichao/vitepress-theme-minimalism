<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <slot name="doc-before"></slot>
      <template v-for="year in tabs.archive" :key="year">
        <div class="title">{{ year }}</div>
        <PostListLite :posts="posts.archive[year]" />
      </template>
      <slot name="doc-after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import PostListLite from '../components/PostListLite.vue';
import { useGroup } from '../composables/useGroup';


const { theme } = useData();
const { tabs, posts } = useGroup(theme.value?.posts || []);
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.25rem;
  padding: 14px 0 8px;
  font-family: var(--font-family-number);
}

.bold {
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .bold {
    font-size: 1.5rem;
  }
}
</style>
