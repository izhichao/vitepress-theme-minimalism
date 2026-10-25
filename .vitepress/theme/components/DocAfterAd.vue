<template>
  <AdItem :custom="ads" type="doc" />
</template>

<script lang="ts" setup>
import AdItem from '../../../src/components/AdItem.vue';
import { ads } from '../ads.ts';
</script>
