import { App } from 'vue';
import Home from './views/HomeView.vue';
import Archives from './views/ArchivesView.vue';
import Tags from './views/TagsView.vue';
import Page from './views/PageView.vue';
import './styles/index.less';

export { default as MinimalismLayout } from './MinimalismLayout.vue';
export const registerComponents = (app: App) => {
  app.component('Home', Home);
  app.component('Tags', Tags);
  app.component('Archives', Archives);
  app.component('Page', Page);
};
