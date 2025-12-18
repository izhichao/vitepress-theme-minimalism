import { inBrowser, Router } from 'vitepress';
import MinimalismTheme from '../../src';
import ThemeLayout from './ThemeLayout.vue';

export const defaultPassword = 'vitepress-theme-minimalism';

export const passwordConfig: Record<string, string> = {
  c10a87: ''
};

export default {
  extends: MinimalismTheme,
  Layout: ThemeLayout,
  enhanceApp({ router }: { router: Router }) {
    if (inBrowser) {
      const themeBefore = router.onBeforeRouteChange;
      const themeAfter = router.onAfterRouteChange;

      router.onBeforeRouteChange = (to) => {
        themeBefore?.(to);
        if (to.includes('password')) return;

        // 查找匹配的文章 ID
        const postId = Object.keys(passwordConfig).find((id) => to.includes(id));
        if (!postId) return; // 如果没有匹配的文章，不需要密码

        // 从 localStorage 中获取所有文章的密码对象
        const passwordsObj = JSON.parse(localStorage.getItem('post_passwords') || '{}');
        const configuredPassword = passwordConfig[postId];
        // 如果配置的密码为空，使用默认密码
        const correctPassword = configuredPassword || defaultPassword;

        // 检查该文章的密码是否已验证且正确
        if (passwordsObj[postId] === correctPassword) return;

        router.go(`/password?redirect=${to}`);

        return false;
      };

      router.onAfterRouteChange = (to) => {
        themeAfter?.(to);
      };
    }
  }
};
