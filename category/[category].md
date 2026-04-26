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
import { onMounted } from "vue";
import { useData } from "vitepress"
import AdItem from '/src/components/AdItem.vue';
import { ads } from '/.vitepress/theme/ads.ts';

const { params, site } = useData();

onMounted(() => {
  if (params.value.category !== 'index') {
    document.title = `分类：${params.value.category} | ${site.value.titleTemplate}`;
  }
});
</script>
