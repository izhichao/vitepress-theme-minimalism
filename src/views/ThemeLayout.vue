<script setup>
import DefaultTheme from 'vitepress/theme';
import CommentItem from '../components/CommentItem.vue';
const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-after>
      <CommentItem />
    </template>
  </Layout>
</template>
