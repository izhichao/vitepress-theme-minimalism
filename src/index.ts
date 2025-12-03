import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import Home from './views/HomeView.vue';
import Group from './views/GroupView.vue';
import Page from './views/PageView.vue';
import Password from './views/PasswordView.vue';
import './styles/index.less';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Home', Home);
    app.component('Group', Group);
    app.component('Page', Page);
    app.component('Password', Password);
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom('.main img', { background: 'rgba(0,0,0,0.2)' });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  }
};
