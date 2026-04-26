import { onMounted, onUnmounted } from 'vue';
import { EnhanceAppContext, inBrowser } from 'vitepress';
import type { ThemeConfig } from './types';
import DefaultTheme from 'vitepress/theme';
import Home from './views/HomeView.vue';
import Page from './views/PageView.vue';
import Archives from './views/ArchivesView.vue';
import CategoryClassic from './views/CategoryClassicView.vue';
import Category from './views/CategoryView.vue';
import PostMeta from './components/PostMeta.vue';
import { bindFancybox, destroyFancybox } from './utils/fancybox';
import { BProgress } from '@bprogress/core';
import '@bprogress/core/css';
import './styles/index.less';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.component('Home', Home);
    app.component('Archives', Archives);
    app.component('CategoryClassic', CategoryClassic);
    app.component('Category', Category);
    app.component('Page', Page);
    app.component('PostMeta', PostMeta);
    if (inBrowser) {
      BProgress.configure({ showSpinner: false });
      let lastPath = '';
      router.onBeforeRouteChange = (to) => {
        if (to && to.split(/[\?#]/)[0] !== lastPath) {
          BProgress.start();
          destroyFancybox(); // 销毁图片查看器

          if ((siteData.value.themeConfig as ThemeConfig).transition) {
            const VPContent = document.querySelector('#VPContent');
            VPContent?.classList.remove('fade-in');
          }
        }
      };
      router.onAfterRouteChange = (to) => {
        const toPath = to ? to.split(/[\?#]/)[0] : '';
        if (toPath !== lastPath) {
          lastPath = toPath;
          BProgress.done();
          bindFancybox(); // 绑定图片查看器

          // 路由切换飞入动画（受 themeConfig.transition 控制）
          if ((siteData.value.themeConfig as ThemeConfig).transition) {
            const VPContent = document.querySelector('#VPContent');
            VPContent?.classList.add('fade-in');
          }
        }
      };
    }
  },
  setup() {
    onMounted(() => {
      bindFancybox();
    });
    onUnmounted(() => {
      destroyFancybox();
    });
  }
};
