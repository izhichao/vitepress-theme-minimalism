<template>
  <ClientOnly>
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="client"
      :data-ad-slot="slot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
defineProps({
  client: String,
  slot: String
});

onMounted(() => {
  try {
    // @ts-ignore
    window.addAds();
  } catch (e) {
    console.log(e);
  }
});
</script>
