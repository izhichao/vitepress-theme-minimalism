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
