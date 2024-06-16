<template>
  <div class="info" v-if="$frontmatter.datetime">
    <div class="date">
      <span class="iconfont">&#xe7eb;</span>
      <span>{{ $frontmatter.datetime.substring(0, 16) }}</span>
    </div>
    <div class="tags">
      <a
        :href="withBase(`/pages/tags.html?tag=${item.replaceAll('&', '%26')}`)"
        v-for="item in $frontmatter.tags"
        class="tag"
      >
        {{ item }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress';
</script>

<style lang="less" scoped>
.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.date {
  .iconfont {
    font-size: 14px;
    margin-right: 4px;
    vertical-align: bottom;
  }
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.tag {
  font-size: 14px;
  display: inline-block;
  padding: 0 8px;
  border-radius: 2px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  transition: 0.4s;

  &:not(:last-of-type) {
    margin-right: 8px;
  }

  &:hover {
    color: var(--vp-c-brand);
    background-color: var(--vp-c-gutter);
  }
}
</style>
