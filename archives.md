---
title: 归档
layout: page
---

<Group type='archives'>
  <template #doc-after>
    <AdItem :custom="ads" type="doc" />
  </template>
</Group>

<script lang="ts" setup>
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/src/ads.ts';
</script>
