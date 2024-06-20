<template>
  <Layout>
    <template #page-top>
      <AdItem v-if="ads?.pageTop" :ads="ads?.pageTop" />
      <AdsenseItem v-if="adsense?.pageTop" :client="adsense.client" :slot="adsense?.pageTop" />
    </template>
    <template #page-bottom>
      <AdItem v-if="ads?.pageBottom" :ads="ads?.pageBottom" />
      <AdsenseItem v-if="adsense?.pageBottom" :client="adsense.client" :slot="adsense?.pageBottom" />
    </template>
    <template #sidebar-nav-before>
      <AdItem v-if="ads?.sidebarNavBefore" :ads="ads?.sidebarNavBefore" />
      <AdsenseItem v-if="adsense?.sidebarNavBefore" :client="adsense.client" :slot="adsense?.sidebarNavBefore" />
    </template>
    <template #sidebar-nav-after>
      <AdItem v-if="ads?.sidebarNavAfter" :ads="ads?.sidebarNavAfter" />
      <AdsenseItem v-if="adsense?.sidebarNavAfter" :client="adsense.client" :slot="adsense?.sidebarNavAfter" />
    </template>
    <template #aside-outline-before>
      <AdItem v-if="ads?.asideOutlineAfter" :ads="ads?.asideOutlineAfter" />
      <AdsenseItem v-if="adsense?.asideOutlineAfter" :client="adsense.client" :slot="adsense?.asideOutlineAfter" />
    </template>
    <template #aside-outline-after>
      <AdItem v-if="ads?.asideOutlineAfter" :ads="ads?.asideOutlineAfter" />
      <AdsenseItem v-if="adsense?.asideOutlineAfter" :client="adsense.client" :slot="adsense?.asideOutlineAfter" />
    </template>
    <template #doc-before>
      <AdItem v-if="ads?.docBefore" :ads="ads?.docBefore" />
      <AdsenseItem v-if="adsense?.docBefore" :client="adsense.client" :slot="adsense?.docBefore" />
    </template>
    <template #doc-after>
      <AdItem v-if="ads?.docAfter" :ads="ads?.docAfter" />
      <AdsenseItem v-if="adsense?.docAfter" :client="adsense.client" :slot="adsense?.docAfter" />
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
import AdItem from '../components/AdItem.vue';
import { useData } from 'vitepress';
const { Layout } = DefaultTheme;
const { theme } = useData();
const ads = theme.value.ads;
const adsense = theme.value.adsense;
</script>
