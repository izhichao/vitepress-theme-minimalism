<template>
  <div class="share">
    <button class="share__button" :class="{ copied }" aria-live="assertive" @click="copyLink(shareLink)">
      <span v-if="!copied" class="share__button__text">
        <Icon
          class="iconify"
          icon="solar:share-bold"
          :ssr="true"
          :inline="true"
          :ariaLabel="isZh ? '分享此页面的图标' : 'Share page icon'"
          width="16"
          height="16"
        />
        {{ isZh ? '点击分享此页面' : 'Share this page' }}
      </span>
      <span v-else class="share__button__text">
        <Icon
          class="iconify"
          icon="mdi:thumbs-up"
          :ssr="true"
          :inline="true"
          :ariaLabel="isZh ? '复制成功图标' : 'Copied icon'"
          width="16"
          height="16"
        />
        {{ isZh ? '链接已复制!' : 'Link copied!' }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed, ref } from 'vue';
import { useData, useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';

const { lang } = useData();
const isZh = computed(() => (lang.value || 'zh').startsWith('zh'));

const useCopyLink = () => {
  const copied = ref(false);

  const copyLink = async (text: string) => {
    try {
      if (!navigator.clipboard) {
        alert(isZh.value ? '当前浏览器不支持自动复制，请手动复制。' : 'Clipboard API not supported, please copy manually.');
        return;
      }
      await navigator.clipboard.writeText(text);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      alert(isZh.value ? '复制失败，请手动复制。' : 'Copy failed, please copy manually.');
    }
  };

  return { copied, copyLink };
};

// 复制链接功能
const { copied, copyLink } = useCopyLink();

function useShareLink(): ComputedRef<string> {
  const router = useRouter();
  return computed(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${router.route.path}`;
  });
}

// 当前页面的分享链接
const shareLink = useShareLink();
</script>

<style lang="less" scoped>
.share {
  padding: 0 1em 1em;

  &__button {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    z-index: 1;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 1em;
    background-color: var(--vp-c-bg-alt);
    padding: 0.5em 1em;
    width: 100%;
    overflow: hidden;
    color: var(--vp-c-brand-1);

    &:hover {
      transform: translateY(-1px);
      border-color: var(--vp-c-brand-soft);
      background-color: var(--vp-c-brand-soft);
    }

    &::before {
      position: absolute;
      top: 0;
      left: -100%;
      z-index: -1;
      transition: left 0.6s ease;
      background-color: var(--vp-c-brand-soft);
      width: 100%;
      height: 100%;
      content: '';
    }

    &.copied {
      color: var(--vp-c-brand-1);

      &:active {
        transform: scale(0.9);
      }

      &::before {
        left: 0;
        background-color: var(--vp-c-brand-soft);
      }
    }

    &__text {
      font-weight: 500;
      font-size: .875em;
    }
  }
}

.iconify {
  display: inline-block;
  flex-shrink: 0;
  margin: 0 0 -0.1em 0;
  color: var(--vp-c-brand-1);
}
</style>
