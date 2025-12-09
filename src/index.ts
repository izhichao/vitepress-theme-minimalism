import { onMounted, onUnmounted } from 'vue';
import { EnhanceAppContext, inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Home from './views/HomeView.vue';
import Group from './views/GroupView.vue';
import Page from './views/PageView.vue';
import Password from './views/PasswordView.vue';
import { bindFancybox, destroyFancybox } from './utils/fancybox';
import { BProgress } from '@bprogress/core';
import '@bprogress/core/css';
import './styles/index.less';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }: EnhanceAppContext) {
    app.component('Home', Home);
    app.component('Group', Group);
    app.component('Page', Page);
    app.component('Password', Password);
    if (inBrowser) {
      BProgress.configure({ showSpinner: false });
      router.onBeforeRouteChange = () => {
        BProgress.start();
        destroyFancybox(); // 销毁图片查看器
      };
      router.onAfterRouteChange = () => {
        BProgress.done();
        bindFancybox(); // 绑定图片查看器
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
