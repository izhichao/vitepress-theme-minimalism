<template>
  <div class="ZCContainer">
    <div class="ZCLayout">
      <div class="ZCContent">
        <slot name="doc-before"></slot>

        <h1 class="page-title">
          <span>{{ (isCategory ? '分类' : '标签') + (currentName ? '：' + currentName : '') }}</span>
          <span class="page-title__count" v-if="currentName">{{ filteredPosts.length }} 篇</span>
        </h1>

        <TabList
          :type="type"
          :tabs="isCategory ? tabs.category : tabs.tag"
          :posts="isCategory ? posts.category : undefined"
          :linkMode="true"
          :linkPrefix="isCategory ? '/category/' : '/tags/'"
          :selected="currentName || null"
        />

        <div v-if="currentName" class="post-list-wrapper">
          <PostList :posts="filteredPosts" :showPinned="false" />
        </div>

        <slot name="doc-after"></slot>
      </div>
      <aside class="ZCAside ZCAside--left">
        <slot name="aside-left"></slot>
      </aside>
      <aside class="ZCAside ZCAside--right">
        <slot name="aside-right"></slot>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { computed } from 'vue';
import { useData } from 'vitepress';
import TabList from '../components/TabList.vue';
import PostList from '../components/PostList.vue';
import { useGroup } from '../composables/useGroup';

const props = defineProps({
  type: {
    type: String as PropType<'category' | 'tag' | 'archive'>,
    default: 'category' // 'category' | 'tag'
  }
});

const isCategory = computed(() => props.type === 'category');

const { theme, page } = useData();
const { tabs, posts } = useGroup(theme.value?.posts ?? []);

// 从动态路由参数获取对应名称；由于通过 paths.ts 生成 index，当值为 'index' 时，视为空。
const currentName = computed(() => {
  const params = page.value.params as Record<string, string>;
  const val = isCategory.value ? params?.category : params?.tag;
  return !val || val === 'index' ? '' : val;
});

const filteredPosts = computed(() => posts[props.type]?.[currentName.value] ?? []);
</script>

<style lang="less" scoped>
@import '../styles/page.less';

.page-title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-family-number);
  font-weight: 700;
  padding: 0 0 1rem;
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
  line-height: 1.5;

  &__count {
    font-size: 0.875rem;
    color: var(--vp-c-text-3);
  }
}

.post-list-wrapper {
  margin-top: 1.5rem;
}
</style>
