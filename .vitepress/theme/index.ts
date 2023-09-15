import DefaultTheme from 'vitepress/theme';
import Home from './src/views/HomeView.vue';
import Archives from './src/views/ArchivesView.vue';
import Tags from './src/views/TagsView.vue';
import Page from './src/views/PageView.vue';
import './src/styles/index.less';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Home', Home);
    app.component('Tags', Tags);
    app.component('Archives', Archives);
    app.component('Page', Page);
  }
};
