---
title: 分类
layout: page
---

<CategoryClassic>
  <template #doc-after>
    <AdItem :custom="ads" type="doc" />
  </template>
</CategoryClassic>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>
