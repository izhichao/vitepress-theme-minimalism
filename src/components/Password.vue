<template>
  <div class="password">
    <div class="password__box">
      <h1 class="password__title">🔒 访问受限</h1>
      <p class="password__desc">此内容需要密码才能访问</p>

      <input v-model="input" type="password" placeholder="请输入访问密码" @keyup.enter="handleSubmit" class="password__input" />
      <button @click="handleSubmit" class="password__button">解锁内容</button>

      <p v-if="error" class="password__error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useData, inBrowser } from 'vitepress';

const { frontmatter } = useData();
const input = ref('');
const error = ref('');

// 浏览器端 SHA-256 哈希
const hashInBrowser = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

async function handleSubmit() {
  const hash = String(frontmatter.value?.password ?? '');
  const inputHash = await hashInBrowser(input.value);

  if (inputHash === hash) {
    // 保存哈希到 localStorage，下次访问免输入
    if (inBrowser) {
      const id = frontmatter.value?.id || '';
      const obj = JSON.parse(localStorage.getItem('post_passwords') || '{}');
      obj[id] = inputHash;
      localStorage.setItem('post_passwords', JSON.stringify(obj));
      window.location.reload();
    }
  } else {
    error.value = '密码错误，请重新输入';
  }
}
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
