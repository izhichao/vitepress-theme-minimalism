<template>
  <div class="amazing">
    <a class="amazing__link" :href="item.link || '#'" v-for="item in computedAds">
      <img class="amazing__img" :src="item.img" :title="item.title" :alt="item.title" />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IAd } from '../types';

const props = defineProps({
  ads: { type: Array<IAd | IAd[]>, required: true }
});

const computedAds = computed(() => {
  const newArr: IAd[] = [];
  props.ads.forEach((item) => {
    // ramdom ads
    if (Array.isArray(item)) {
      const random = item[Math.floor(Math.random() * item.length)];
      newArr.push(random);
    } else {
      newArr.push(item);
    }
  });
  return newArr;
});

</script>

<style lang="less" scoped>
.amazing {
  &__img {
    width: 100%;
  }
}
</style>
