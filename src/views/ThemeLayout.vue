<template>
  <Layout>
    <template #page-top>
      <AdsenseItem v-if="adsense && adsense['page-top']" :client="adsense.client" :slot="adsense['page-top']" />
    </template>
    <template #page-bottom>
      <AdsenseItem
        v-if="adsense && adsense['page-bottom']"
        :client="adsense.client"
        :slot="adsense['page-bottom']"
      />
    </template>
    <template #sidebar-nav-before>
      <AdsenseItem
        v-if="adsense && adsense['sidebar-nav-before']"
        :client="adsense.client"
        :slot="adsense['sidebar-nav-before']"
      />
    </template>
    <template #sidebar-nav-after>
      <AdsenseItem
        v-if="adsense && adsense['sidebar-nav-after']"
        :client="adsense.client"
        :slot="adsense['sidebar-nav-after']"
      />
    </template>
    <template #aside-outline-before>
      <AdsenseItem
        v-if="adsense && adsense['aside-outline-before']"
        :client="adsense.client"
        :slot="adsense['aside-outline-before']"
      />
    </template>
    <template #aside-outline-after>
      <AdsenseItem
        v-if="adsense && adsense['aside-outline-after']"
        :client="adsense.client"
        :slot="adsense['aside-outline-after']"
      />
    </template>
    <template #doc-before>
      <AdsenseItem
        v-if="adsense && adsense['doc-before']"
        :client="adsense.client"
        :slot="adsense['doc-before']"
      />
    </template>
    <template #doc-after>
      <AdsenseItem v-if="adsense && adsense['doc-after']" :client="adsense.client" :slot="adsense['doc-after']" />
      <CommentItem />
    </template>
    <template #doc-footer-before><PostInfoItem /></template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import CommentItem from '../components/CommentItem.vue';
import PostInfoItem from '../components/PostInfoItem.vue';
import AdsenseItem from '../components/AdsenseItem.vue';
import { useData } from 'vitepress';
const { Layout } = DefaultTheme;
const { theme } = useData();
const adsense = theme.value.adsense;
</script>
