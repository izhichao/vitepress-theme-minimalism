<template>
  <ins
    class="adsbygoogle"
    style="display: block"
    :data-ad-client="client"
    :data-ad-slot="slot"
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
</template>

<script lang="ts" setup>

defineProps({
  client: String,
  slot: String
});

</script>
