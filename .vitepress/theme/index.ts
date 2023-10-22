import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import { registerComponents } from './src';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    registerComponents(app);
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
