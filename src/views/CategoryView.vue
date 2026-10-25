<template>
  <div class="ZCContainer">
    <div class="ZCLayout">
      <div class="ZCContent">
        <slot name="doc-before">
          <component :is="slotDocBefore" v-if="slotDocBefore" />
        </slot>

        <h1 class="page-title">
          <span>{{ titleText }}</span>
          <span class="page-title__count" v-if="currentName">{{ countText }}</span>
        </h1>

        <TabList
          :type="type"
          :tabs="isCategory ? tabs.category : tabs.tag"
          :posts="isCategory ? posts.category : undefined"
          :linkPrefix="isCategory ? '/category/' : '/tags/'"
          :selected="currentName || null"
        />

        <div v-if="currentName" class="post-list-wrapper">
          <PostList :posts="filteredPosts" :showPinned="false" />
        </div>

        <slot name="doc-after">
          <component :is="slotDocAfter" v-if="slotDocAfter" />
        </slot>
      </div>
      <aside class="ZCAside ZCAside--left">
        <slot name="aside-left">
          <component :is="slotAsideLeft" v-if="slotAsideLeft" />
        </slot>
      </aside>
      <aside class="ZCAside ZCAside--right">
        <slot name="aside-right">
          <component :is="slotAsideRight" v-if="slotAsideRight" />
        </slot>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useData } from 'vitepress';
import TabList from '../components/TabList.vue';
import PostList from '../components/PostList.vue';
import { useGroup } from '../composables/useGroup';
import { resolveSlot } from '../utils/resolveSlot.ts';

const props = defineProps({
  type: {
    type: String as PropType<'category' | 'tag'>,
    default: 'category'
  }
});

const isCategory = computed(() => props.type === 'category');

const { theme, page, lang } = useData();
const isZh = computed(() => (lang.value || 'zh').startsWith('zh'));
const { tabs, posts } = useGroup(theme.value?.posts ?? []);

const titleText = computed(() => {
  if (isZh.value) {
    const prefix = isCategory.value ? '分类' : '标签';
    return currentName.value ? `${prefix}：${currentName.value}` : prefix;
  }
  if (isCategory.value) {
    return currentName.value ? `Category: ${currentName.value}` : 'Category';
  }
  return currentName.value ? `Tag: ${currentName.value}` : 'Tag';
});

const countText = computed(() => {
  const count = filteredPosts.value.length;
  if (isZh.value) return `${count} 篇`;
  return `${count} ${count === 1 ? 'post' : 'posts'}`;
});

const currentTarget = computed(() => (isCategory.value ? 'category' : 'tags'));
const slotDocBefore = computed(() => resolveSlot(theme.value.slots?.docBefore, currentTarget.value));
const slotDocAfter = computed(() => resolveSlot(theme.value.slots?.docAfter, currentTarget.value));
const slotAsideLeft = computed(() => resolveSlot(theme.value.slots?.asideLeft, currentTarget.value));
const slotAsideRight = computed(() => resolveSlot(theme.value.slots?.asideRight, currentTarget.value));

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
