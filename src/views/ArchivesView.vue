<template>
  <div class="ZCContainer">
    <div class="ZCLayout">
      <div class="ZCContent">
        <slot name="doc-before">
          <component :is="slotDocBefore" v-if="slotDocBefore" />
        </slot>
        <template v-for="year in tabs.archive" :key="year">
          <div class="title">{{ year }}</div>
          <PostListLite :posts="posts.archive[year]" />
        </template>
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
import { computed } from 'vue';
import { useData } from 'vitepress';
import PostListLite from '../components/PostListLite.vue';
import { useGroup } from '../composables/useGroup';
import { resolveSlot } from '../utils/resolveSlot.ts';

const { theme } = useData();
const { tabs, posts } = useGroup(theme.value?.posts || []);

const slotDocBefore = computed(() => resolveSlot(theme.value.slots?.docBefore, 'archives'));
const slotDocAfter = computed(() => resolveSlot(theme.value.slots?.docAfter, 'archives'));
const slotAsideLeft = computed(() => resolveSlot(theme.value.slots?.asideLeft, 'archives'));
const slotAsideRight = computed(() => resolveSlot(theme.value.slots?.asideRight, 'archives'));
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.5rem;
  padding: 2rem 0 1rem;
  font-weight: 600;
  font-family: var(--font-family-number);

  &:first-of-type {
    padding-top: 0;
  }
}
</style>
