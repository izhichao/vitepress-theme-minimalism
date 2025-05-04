<template>
  <div class="info" v-if="$frontmatter.datetime">
    <div class="date left">
      <Icon class="iconify" icon="mingcute:time-line" />
      <span>{{ $frontmatter.datetime.substring(0, 16) }}</span>
    </div>
    <div class="right">
      <div class="tag">
        <span v-if="$frontmatter.tags">
          <Icon class="iconify" icon="mingcute:tag-line" />
          <a
            :href="withBase(`${outDir}/tags.html?tags=${item.replaceAll('&', '%26')}`)"
            v-for="item in $frontmatter.tags"
            class="tag__item"
          >
            {{ item }}
          </a>
        </span>
      </div>

      <div class="category">
        <span v-if="$frontmatter.category">
          <Icon class="iconify" icon="iconamoon:category" />
          <a
            :href="withBase(`${outDir}/category.html?category=${$frontmatter.category.replaceAll('&', '%26')}`)"
            class="category__item"
          >
            {{ $frontmatter.category }}
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress';
import { useOutDir } from '../composables/useOutDir';
import { Icon } from '@iconify/vue';
const { outDir } = useOutDir();
</script>

<style lang="less" scoped>
.iconify {
  margin-right: 6px;
}

.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.right {
  display: flex;
  gap: 10px;
}

.date {
  font-weight: 500;
}

.tag,
.category {
  &__item {
    display: inline-block;
    padding: 0 8px;
    border-radius: 2px;
    background-color: var(--vp-c-bg-alt);
    transition: 0.4s;

    &:not(:last-of-type) {
      margin-right: 8px;
    }

    &:hover {
      color: var(--vp-c-brand);
      background-color: var(--vp-c-gutter);
    }
  }
}

@media (max-width: 768px) {
  .info,
  .right {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
