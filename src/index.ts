import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import Home from './views/HomeView.vue';
import Archives from './views/ArchivesView.vue';
import Tags from './views/TagsView.vue';
import Page from './views/PageView.vue';
import ThemeLayout from './views/ThemeLayout.vue';
import './styles/index.less';

export default {
  extends: DefaultTheme,
  Layout: ThemeLayout,
  enhanceApp({ app }) {
    app.component('Home', Home);
    app.component('Tags', Tags);
    app.component('Archives', Archives);
    app.component('Page', Page);
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
