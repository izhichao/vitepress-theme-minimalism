<template>
  <div class="password">
    <div class="password__box">
      <h1 class="password__title">🔒 访问受限</h1>
      <p class="password__desc">此内容需要密码才能访问</p>

      <input
        v-model="password"
        type="password"
        placeholder="请输入访问密码"
        @keyup.enter="handleSubmit"
        class="password__input"
      />
      <button @click="handleSubmit" class="password__button">解锁内容</button>

      <p v-if="error" class="password__error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress';

// 定义 props
const props = defineProps<{
  passwordConfig?: Record<string, string>;
  defaultPassword?: string;
}>();

const router = useRouter();
const password = ref('');
const error = ref('');
let redirectUrl = '/';
let postId = '';
let correctPassword = '';

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  redirectUrl = params.get('redirect') || '/';

  const passwordConfig = props.passwordConfig || {};
  const defaultPassword = props.defaultPassword || '';

  // 从重定向 URL 中提取文章 ID
  postId = Object.keys(passwordConfig).find((id) => redirectUrl.includes(id)) || '';

  if (postId) {
    // 获取配置的密码，如果为空则使用默认密码
    const configuredPassword = passwordConfig[postId];
    correctPassword = configuredPassword || defaultPassword;

    if (!correctPassword) {
      error.value = '密码配置错误';
    }
  } else {
    error.value = '无法找到此内容的密码配置';
  }
});

function handleSubmit() {
  if (!postId || !correctPassword) {
    error.value = error.value || '无法验证密码配置';
    return;
  }

  if (password.value === correctPassword) {
    // 获取现有的密码对象
    const passwordsObj = JSON.parse(localStorage.getItem('post_passwords') || '{}');

    // 更新该文章的密码
    passwordsObj[postId] = password.value;

    // 保存回 localStorage
    localStorage.setItem('post_passwords', JSON.stringify(passwordsObj));

    router.go(redirectUrl);
  } else {
    error.value = '密码错误，请重新输入';
  }
}
</script>

<style lang="less" scoped>
.password {
  min-height: calc(100vh - 4rem - 7rem);
  height: 100%;
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 24rem;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03), 0 8px 16px rgba(0, 0, 0, 0.06);
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
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
