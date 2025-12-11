---
title: 分类
layout: page
---

<Category>
  <template #doc-after>
    <AdItem :custom="ads" type="doc" />
  </template>
</Category>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>
