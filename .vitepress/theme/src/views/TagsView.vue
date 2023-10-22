<template>
  <div class="main-container">
    <div class="main-content">
      <div class="tag">
        <span @click="handleTag(tag)" v-for="tag in orderedTags" :key="tag" class="tag__item">
          {{ tag }}
          <span>{{ posts[tag].length }}</span>
        </span>
      </div>
      <div class="tag__header">{{ selectTag }}</div>

      <PostItem :posts="posts[selectTag]" date="full"></PostItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { groupByTags } from '../utils/groupPosts';
import PostItem from '../components/PostItem.vue';

const { theme } = useData();
const posts = computed(() => groupByTags(theme.value.posts));
// sort tags
const orderedTags = computed(() => {
  return Object.keys(posts.value).sort((a, b) => {
    return a.localeCompare(b);
  });
});

const url = location.href.split('?')[1];
const params = new URLSearchParams(url);
const selectTag = ref(params.get('tag') || '');
const handleTag = (tag: string) => {
  selectTag.value = tag;
};
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.tag {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;

  &__item {
    display: inline-block;
    padding: 4px 16px;
    margin: 6px 8px;
    font-size: 0.875rem;
    line-height: 25px;
    background-color: var(--vp-c-bg-alt);
    transition: 0.4s;
    border-radius: 2px;
    color: var(--vp-c-text-1);
    cursor: pointer;

    &:hover {
      background-color: var(--vp-c-gutter);
    }

    span {
      color: var(--vp-c-brand);
      font-weight: 600;
    }
  }

  &__header {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 1rem 0;
    text-align: left;
  }
}

@media screen and (max-width: 768px) {
  .tag {
    &__header {
      font-size: 1.5rem;
    }
  }
}
</style>
