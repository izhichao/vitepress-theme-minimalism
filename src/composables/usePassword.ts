import { onMounted, ref, watch } from 'vue';
import { useData, inBrowser } from 'vitepress';

export const usePassword = () => {
  const { frontmatter } = useData();

  const verified = ref(true);

  function checkPassword() {
    const pwd = String(frontmatter.value?.password ?? '');
    // 无密码时，直接 return
    if (!pwd) {
      verified.value = true;
      return;
    }
    // 有密码时检查 localStorage 是否已验证
    if (!inBrowser) {
      verified.value = false;
      return;
    }
    const id = frontmatter.value?.id || '';
    const stored = JSON.parse(localStorage.getItem('post_passwords') || '{}');
    // 存储密码不正确时，开启密码验证
    verified.value = stored[id] === pwd;
  }

  // 每次路由切换检查是否需要密码
  watch(
    () => frontmatter.value?.id,
    () => {
      checkPassword();
    }
  );

  onMounted(() => {
    checkPassword();
  });

  return {
    verified
  };
};
