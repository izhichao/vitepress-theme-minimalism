<template>
  <Layout>
    <template #doc-after>
      <CommentItem />
    </template>
    <template #doc-footer-before>
      <PostInfoItem />
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import PostInfoItem from '../../src/components/PostInfoItem.vue';
import CommentItem from './components/CommentItem.vue';

const { Layout } = DefaultTheme;
</script>
