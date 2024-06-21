<template>
  <div class="amazing" v-if="ads">
    <a class="amazing__link" :href="item.link || '#'" v-for="item in computedAds">
      <img class="amazing__img" :src="item.img" :title="item.title" :alt="item.title" />
    </a>
  </div>

  <ins
    v-if="adsense.slot"
    class="adsbygoogle"
    style="display: block"
    :data-ad-client="adsense.client"
    :data-ad-slot="adsense.slot"
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
</template>

<script lang="ts" setup>
import { PropType, computed, onMounted } from 'vue';
import { IAd } from '../types';

const props = defineProps({
  ads: Array<IAd | IAd[]>,
  adsense: Object as PropType<{ client: string; slot: string }>,
  type: String as PropType<'sidebar' | 'aside' | 'doc'>
});

// ads
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

// adsense
onMounted(() => {
  try {
    // @ts-ignore
    window.addAds();
  } catch (e) {
    console.log(e);
  }
});

let padding = '0';

if (props.type === 'aside') {
  padding = '.5rem 1rem';
} else if (props.type === 'sidebar') {
  padding = '.5rem .5rem 0';
} else if (props.type === 'doc') {
  padding = '1rem 0';
}
</script>

<style lang="less" scoped>
.amazing {
  padding: v-bind(padding);

  &__link {
    display: flex;
    justify-content: center;
  }

  &__img {
    width: 100%;
  }
}
</style>
