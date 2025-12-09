import { inBrowser, Router } from 'vitepress';
import MinimalismTheme from '../../src';
import ThemeLayout from './ThemeLayout.vue';

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

        const needsPassword = ['c10a87'].some((id) => to.includes(id));
        if (!needsPassword) return;

        const stored = localStorage.getItem('page_password');
        if (stored === 'vitepress-theme-minimalism') return;
        router.go(`/password?redirect=${to}`);

        return false;
      };

      router.onAfterRouteChange = (to) => {
        themeAfter?.(to);
      };
    }
  }
};
