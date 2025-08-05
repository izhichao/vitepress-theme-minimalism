---
title: 归档
layout: page
---

<Group type='archives'>
  <template #doc-after>
    <AdItem :custom="ad" type="doc" />
  </template>
</Group>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import type { IAd } from '/src/types.ts';

const ad: (IAd | IAd[])[] = [
  {
    title: 'RackNerd - 洛杉矶 DC3 直连线路',
    img: 'https://zhichao.org/images/rn.png',
    link: 'https://link.zhichao.org/rn'
  }
];
</script>
