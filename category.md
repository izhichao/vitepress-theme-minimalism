---
title: 分类
layout: page
---

<Group type='category' lang='zh'>
  <template #doc-after>
    <AdItem :custom="ads" type="doc" />
  </template>
</Group>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';
</script>
