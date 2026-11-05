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
          :selected="currentSlug || null"
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
const { tabs, posts, slugMap } = useGroup(theme.value?.posts ?? []);

// 从动态路由参数获取对应名称（作为路由 slug）
const currentSlug = computed(() => {
  const params = page.value.params as Record<string, string>;
  const val = isCategory.value ? params?.category : params?.tag;
  return !val || val === 'index' ? '' : val;
});

// 当前展示名称：优先用 params.rawName，其次从 slugMap 查找原名，最后回退为 currentSlug
const currentName = computed(() => {
  if (!currentSlug.value) return '';
  const params = page.value.params as Record<string, string>;
  if (params?.rawName) return params.rawName;
  const map = isCategory.value ? slugMap.category : slugMap.tag;
  return map.get(currentSlug.value) || currentSlug.value;
});

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

const filteredPosts = computed(() => {
  if (!currentSlug.value) return [];
  const group = posts[props.type];
  return group?.[currentSlug.value] ?? group?.[currentName.value] ?? [];
});
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
