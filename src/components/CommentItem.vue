<template>
  <Waline
    v-if="serverURL"
    :serverURL="serverURL"
    :path="path"
    :lang="lang"
    :locale="locale"
    :emoji="emoji"
    :dark="dark"
    :commentSorting="commentSorting"
    :meta="meta"
    :requiredMeta="requiredMeta"
    :login="login"
    :wordLimit="wordLimit"
    :pageSize="pageSize"
    :imageUploader="imageUploader"
    :highlighter="highlighter"
    :texRenderer="texRenderer"
    :search="search"
    :copyright="copyright"
    :recaptchaV3Key="recaptchaV3Key"
    :turnstileKey="turnstileKey"
    :reaction="reaction"
  />
</template>

<script setup>
import { Waline } from '@waline/client/component';
import { computed } from 'vue';
import { useRoute, useData } from 'vitepress';
import '@waline/client/style';

const { theme } = useData();

const path = computed(() => useRoute().path);
const dark = 'html[class="dark"]';
const {
  serverURL,
  lang,
  locale,
  emoji,
  commentSorting,
  meta,
  requiredMeta,
  login,
  wordLimit,
  pageSize,
  imageUploader,
  highlighter,
  texRenderer,
  search,
  copyright,
  recaptchaV3Key,
  turnstileKey,
  reaction
} = theme.value?.comment;
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
