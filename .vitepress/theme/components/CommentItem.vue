<template>
  <ClientOnly>
    <Waline :serverURL="serverURL" :path="path" :dark="dark" />
  </ClientOnly>
</template>

<script setup>
import { Waline } from '@waline/client/component';
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import '@waline/client/style';

const serverURL = 'https://waline.vercel.app';
const route = useRoute();
const path = computed(() => route.path);
const dark = 'html[class~="dark"]';
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
