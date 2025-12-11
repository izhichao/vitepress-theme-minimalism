---
title: 归档
layout: page
---

<Archives>
  <template #doc-after>
    <AdItem :custom="ads" type="doc" />
  </template>
</Archives>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>
