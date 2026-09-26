<template>
  <Teleport to="body">
    <div v-if="!verified" class="password">
      <div class="password__box">
        <h1 class="password__title">🔒 访问受限</h1>
        <p class="password__desc">此内容需要密码才能访问</p>

        <input v-model="input" type="password" placeholder="请输入访问密码" class="password__input" :disabled="loading" @keyup.enter="handleSubmit" />
        <button @click="handleSubmit" class="password__button" :disabled="loading">{{ loading ? '正在解锁' : '解锁内容' }}</button>

        <p v-if="error" class="password__error">{{ error }}</p>
      </div>
    </div>
  </Teleport>
  <template v-if="verified">
    <slot></slot>
    <div class="vp-doc-encrypted-content" v-html="html"></div>
  </template>
</template>

<script lang="ts" setup>
import { nextTick, onUnmounted, ref, toRaw, watch } from 'vue';
import { inBrowser, useData } from 'vitepress';
import { useLayout } from 'vitepress/theme';
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js';
import { decryptStoredContent, unlockContent, type EncryptedContentPayload } from '../utils/encryption.ts';
import { bindFancybox } from '../utils/fancybox.ts';

const props = defineProps<{
  payload: EncryptedContentPayload;
}>();

const { frontmatter, page, theme } = useData();
const layout = useLayout();
const input = ref('');
const html = ref('');
const error = ref('');
const loading = ref(false);
const verified = ref(false);
let restoreSequence = 0;

const getId = (): string => String(frontmatter.value?.id || page.value?.relativePath || 'post');

const updateOutline = () => {
  if (!inBrowser) return;

  const headers = getHeaders(frontmatter.value?.outline ?? theme.value.outline);
  const layoutHeaders = toRaw(layout.headers) as { value: typeof headers };
  layoutHeaders.value = headers;
};

const renderDecrypted = async (content: string, sequence: number): Promise<boolean> => {
  html.value = content;
  verified.value = true;
  await nextTick();
  if (sequence !== restoreSequence) return false;

  updateOutline();
  bindFancybox();
  return true;
};

const restore = async () => {
  const sequence = ++restoreSequence;
  const content = await decryptStoredContent(getId(), props.payload);
  if (sequence === restoreSequence && content) {
    await renderDecrypted(content, sequence);
  }
};

async function handleSubmit() {
  if (!input.value) {
    error.value = '请输入访问密码';
    return;
  }

  const sequence = ++restoreSequence;
  loading.value = true;
  error.value = '';
  try {
    const content = await unlockContent(getId(), input.value, props.payload);
    if (sequence === restoreSequence) {
      if (await renderDecrypted(content, sequence)) {
        input.value = '';
      }
    }
  } catch {
    if (sequence === restoreSequence) error.value = '密码错误，请重新输入';
  } finally {
    if (sequence === restoreSequence) loading.value = false;
  }
}

watch(
  () => props.payload?.data,
  () => {
    html.value = '';
    error.value = '';
    verified.value = false;
    loading.value = false;
    updateOutline();
    void restore();
  },
  { immediate: true }
);

onUnmounted(() => {
  ++restoreSequence;
});
</script>

<style lang="less" scoped>
.password {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #fafafa, #f4f4f5);
  padding: 2rem;

  &__box {
    background: #fff;
    padding: 3rem 2.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e5e5e5;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.02),
      0 4px 8px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 24rem;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.03),
        0 8px 16px rgba(0, 0, 0, 0.06);
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #000;
    margin: 0 0 1.25rem 0;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  &__desc {
    color: #666;
    font-size: 0.875rem;
    margin: 0 0 1.25rem 0;
    line-height: 1.5;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
    color: #000;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    transition: all 0.15s ease;
    font-family: inherit;
    line-height: 1.5;

    &::placeholder {
      color: #a3a3a3;
    }

    &:hover {
      border-color: #d4d4d4;
    }

    &:focus {
      outline: none;
      border-color: #000;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
    }
  }

  &__button {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
    font-weight: 500;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    line-height: 1.5;

    &:hover {
      background: #171717;
      transform: translateY(-1px);
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 4px 8px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: translateY(0);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.08);
    }
  }

  &__error {
    margin: 1rem 0 0 0;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 0.5rem;
    color: #dc2626;
    font-size: 0.875rem;
    line-height: 1.5;
    animation: shake 0.3s ease;
  }

  @media (max-width: 640px) {
    padding: 1rem;

    &__box {
      padding: 2rem 1.5rem;
    }

    &__title {
      font-size: 1.5rem;
    }
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>
