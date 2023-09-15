<template>
  <div class="main-container">
    <div class="main-content">
      <div v-for="item in posts">
        <div class="archive">{{ item.year }}</div>
        <PostItem :posts="item.data"></PostItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import { computed } from 'vue';
import { groupByYears } from '../utils/groupPosts';
import PostItem from '../components/PostItem.vue';
const { theme } = useData();
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
