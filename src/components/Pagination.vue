<template>
  <nav class="pagination" v-if="posts">
    <!-- First Page (只在超过max页时显示) -->
    <a
      v-if="total > max"
      class="pagination__item pagination__item--nav"
      :class="{ 'pagination__item--disabled': pagination === 1 }"
      :href="withBase(homepage ? '/index' : '/page-1')"
    >
      <Icon icon="mingcute:arrows-left-line" />
    </a>

    <!-- Previous Page (始终显示) -->
    <a
      class="pagination__item pagination__item--nav"
      :class="{ 'pagination__item--disabled': pagination === 1 }"
      :href="withBase(pagination <= 2 ? (homepage ? '/index' : '/page-1') : `/page-${pagination - 1}`)"
    >
      <Icon icon="mingcute:left-line" />
    </a>

    <!-- Page Numbers -->
    <a
      v-for="page in pages"
      :key="page"
      class="pagination__item pagination__item--page"
      :class="{ 'pagination__item--active': pagination === page }"
      :href="withBase(page === 1 && homepage ? '/index' : `/page-${page}`)"
    >
      {{ page }}
    </a>

    <!-- Next Page (始终显示) -->
    <a
      class="pagination__item pagination__item--nav"
      :class="{ 'pagination__item--disabled': pagination === total }"
      :href="withBase(pagination === total ? `/page-${total}` : `/page-${pagination + 1}`)"
    >
      <Icon icon="mingcute:right-line" />
    </a>

    <!-- Last Page (只在超过max页时显示) -->
    <a
      v-if="total > max"
      class="pagination__item pagination__item--nav"
      :class="{ 'pagination__item--disabled': pagination === total }"
      :href="withBase(`/page-${total}`)"
    >
      <Icon icon="mingcute:arrows-right-line" />
    </a>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useData, withBase } from 'vitepress';
import { Icon } from '@iconify/vue';

const props = defineProps({
  pagination: { type: Number, required: true },
  total: { type: Number, required: true },
  homepage: { type: Boolean, default: true }
});

const { theme } = useData();
const posts = theme.value.posts;
const page = theme.value.page;
const max = page?.max || 5;

const pages = ref(findNeighbors(props.pagination, props.total, max));

function findNeighbors(target: number, total: number, max: number) {
  const result: number[] = [];
  const half = Math.floor(max / 2);

  if (total < max) {
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
    return result;
  }

  for (let i = target - half; i <= target + half; i++) {
    if (i >= 1 && i <= total) {
      result.push(i);
    }
  }

  while (result.length < max) {
    const first = result[0];
    const last = result[result.length - 1];

    if (first > 1) {
      result.unshift(first - 1);
    } else if (last < total) {
      result.push(last + 1);
    } else {
      break;
    }
  }
  return result;
}
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  &__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.25rem;
    height: 2.25rem;
    padding: 0 0.5rem;
    background-color: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover:not(&--disabled):not(&--active) {
      background-color: var(--vp-c-bg-soft);
      border-color: var(--vp-c-text-2);
    }

    &--active {
      background-color: var(--vp-c-text-1);
      color: var(--vp-c-bg);
      border-color: var(--vp-c-text-1);
      cursor: default;
    }

    &--disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    &--nav {
      padding: 0 0.375rem;
      min-width: 2.25rem;
    }

    &--page {
      min-width: 2.25rem;
    }
  }
}

@media screen and (max-width: 768px) {
  .pagination {
    gap: 0.25rem;

    &__item {
      min-width: 2rem;
      height: 2rem;
      font-size: 0.8125rem;

      &--nav {
        min-width: 2rem;
        padding: 0 0.25rem;
      }

      &--page {
        min-width: 2rem;
      }
    }
  }
}
</style>
