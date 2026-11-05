<template>
  <div class="tab">
    <a
      v-for="tab in tabs"
      :key="tab"
      :href="withBase(`${linkPrefix}${encodeURIComponent(slugify(tab))}`)"
      class="tab__item"
      :class="{ 'tab__item--active': isSelected(tab), 'tab__item--tag': type === 'tag' }"
    >
      {{ tab }}
      <span v-if="posts && type === 'category'">({{ getPostCount(tab) }})</span>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { withBase } from 'vitepress';
import { slugify } from '../utils/slugify.ts';
import type { IPostObject } from '../types.ts';

const props = defineProps({
  type: {
    type: String as PropType<'category' | 'tag'>,
    required: true
  },
  tabs: { type: Array as PropType<string[]>, required: true },
  posts: Object as PropType<IPostObject>,
  selected: { type: String as PropType<string | null>, default: null },
  linkPrefix: { type: String, default: '/' }
});

const isSelected = (tab: string) => {
  if (!props.selected) return false;
  return props.selected === tab || slugify(props.selected) === slugify(tab);
};

const getPostCount = (tab: string) => {
  if (!props.posts) return 0;
  return (props.posts[tab] || props.posts[slugify(tab)])?.length || 0;
};
</script>

<style lang="less" scoped>
.tab {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &__item {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-1);
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
    }

    &--active {
      background-color: var(--vp-c-brand-1);
      color: var(--vp-c-white);

      &:hover {
        background-color: var(--vp-c-brand-2);
        color: var(--vp-c-white);
      }
    }

    &--tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }
  }
}
</style>
