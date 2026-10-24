---
title: 第2页
layout: page
---

<PageView folder="essays" :pagination="2" :size="6" :index="true">
<template #doc-after>
  <AdItem :custom="ads" type="doc" />
</template>
</PageView>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>