<template>
  <Waline v-if="serverURL" :serverURL="serverURL" :path="path" :dark="dark" />
</template>

<script setup>
import { Waline } from '@waline/client/component';
import { computed } from 'vue';
import { useRoute, useData } from 'vitepress';
import '@waline/client/style';

const { theme } = useData();
const serverURL = theme.value?.comment?.serverURL || '';
const dark = 'html[class="dark"]'
const path = computed(() => useRoute().path);
</script>

<style scoped>
[data-waline] {
  --waline-theme-color: var(--vp-c-brand);
  --waline-active-color: var(--vp-c-brand);
}

:deep(.wl-emoji-popup, .wl-gif-popup) {
  z-index: 99;
}
</style>
