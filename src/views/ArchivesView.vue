<template>
  <div class="main-container">
    <div class="main-content">
      <AdItem v-if="ads?.pageTop" :ads="ads?.pageTop" />
      <AdsenseItem v-if="adsense?.pageTop" :client="adsense.client" :slot="adsense?.pageTop" />
      <div v-for="item in posts">
        <div class="archive">{{ item.year }}</div>
        <ul>
          <PostLiteItem :posts="item.data"></PostLiteItem>
        </ul>
      </div>
      <AdItem v-if="ads?.pageBottom" :ads="ads?.pageBottom" />
      <AdsenseItem v-if="adsense?.pageBottom" :client="adsense.client" :slot="adsense?.pageBottom" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';
import { computed } from 'vue';
import { groupByYears } from '../utils/groupPosts';
import PostLiteItem from '../components/PostLiteItem.vue';
import AdsenseItem from '../components/AdsenseItem.vue';
import AdItem from '../components/AdItem.vue';
const { theme } = useData();
const ads = theme.value.ads;
const adsense = theme.value.adsense;
const posts = computed(() => groupByYears(theme.value.posts));
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.archive {
  padding: 14px 0 8px;
  font-size: 1.25rem;
  font-family: var(--font-family-number);
}
</style>
