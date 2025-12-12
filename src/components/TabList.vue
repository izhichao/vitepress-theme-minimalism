<template>
  <div class="tab">
    <span
      @click="emit('change', tab)"
      v-for="tab in tabs"
      :key="tab"
      class="tab__item"
      :class="{ 'tab__item--active': selected === tab, 'tab__item--tag': type === 'tag' }"
    >
      {{ tab }}
      <span v-if="posts && type === 'category'">({{ posts[tab].length }})</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IPostObject } from '../types';

defineProps({
  type: {
    type: String as PropType<'category' | 'tag' | 'archive'>,
    required: true
  },
  tabs: { type: Array as PropType<string[]>, required: true },
  posts: Object as PropType<IPostObject>,
  selected: { type: String as PropType<string | null>, default: null }
});

const emit = defineEmits(['change']);
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

    &--tag {
      padding: 0.5rem 0.75rem;
      border-radius: 9999px;
      line-height: 1rem;
    }

    &:hover,
    &--active {
      color: var(--vp-c-brand);
      background-color: var(--vp-c-brand-soft);
    }

    // 数字
    span {
      font-weight: 600;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 1rem 0;
    text-align: left;
  }
}

@media screen and (max-width: 768px) {
  .tab {
    gap: 0.375rem;

    &__item {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    &__title {
      font-size: 1.5rem;
    }
  }
}
</style>
