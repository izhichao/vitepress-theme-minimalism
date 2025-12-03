<template>
  <div class="password">
    <div class="password__box">
      <h1 class="password__title">🔒 受保护页面</h1>
      <p class="password__desc">请输入访问密码以继续</p>

      <input
        v-model="password"
        type="password"
        placeholder="输入密码"
        @keyup.enter="handleSubmit"
        class="password__input"
      />
      <button @click="handleSubmit" class="password__button">进入</button>

      <p v-if="error" class="password__error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();
const password = ref('');
const error = ref('');
let redirectUrl = '/';

const props = defineProps({
  correctPassword: {
    type: String,
    default: 'vitepress-theme-minimalism'
  }
});

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  redirectUrl = params.get('redirect') || '/';
});

function handleSubmit() {
  if (password.value === props.correctPassword) {
    localStorage.setItem('page_password', password.value);
    router.go(redirectUrl);
  } else {
    error.value = '密码错误，请重试';
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
  background: #f7f8fa;
  padding: 2rem;

  &__box {
    background: #fff;
    padding: 2rem 3rem;
    border-radius: 0.6rem;
    box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.08);
    text-align: center;
    width: 100%;
    max-width: 22rem;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    color: #222;
    margin-bottom: 1rem;
  }

  &__desc {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  &__input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    margin-bottom: 1.2rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--vp-c-brand);
      box-shadow: 0 0 0 0.15rem rgba(59, 130, 246, 0.25);
    }
  }

  &__button {
    width: 100%;
    padding: 0.6rem;
    font-size: 1rem;
    background: var(--vp-c-brand);
    color: #fff;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: var(--vp-c-brand-3);
    }
  }

  &__error {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.8rem;
  }
}
</style>
