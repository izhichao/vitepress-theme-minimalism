<template>
  <Layout>
    <template #doc-footer-before>
      <PostInfoItem />
    </template>
    <template #doc-after>
      <CommentItem />
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import CommentItem from '../components/CommentItem.vue';
import PostInfoItem from '../components/PostInfoItem.vue';
const { Layout } = DefaultTheme;
</script>
