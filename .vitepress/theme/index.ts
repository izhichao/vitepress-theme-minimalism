import MinimalismTheme from '../../src';
import ThemeLayout from './ThemeLayout.vue';
import DocAfterAd from './components/DocAfterAd.vue';

export default {
  extends: MinimalismTheme,
  Layout: ThemeLayout,
  enhanceApp({ app }: any) {
    app.component('DocAfterAd', DocAfterAd);
  }
};
