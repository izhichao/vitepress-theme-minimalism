---
layout: page
---

<PageView folder="essays" :pagination="1" :size="6" :index="true">
<template #doc-after>
  <AdItem :custom="ads" type="doc" />
</template>
</PageView>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>