import DefaultTheme from 'vitepress/theme';
import { registerComponents } from './src';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    registerComponents(app);
  }
};
