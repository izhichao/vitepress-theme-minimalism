import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Minimalism',
  titleTemplate: 'VitePress Theme Minimalism',
  description: 'VitePress Theme Minimalism',
  themeConfig: {
    outline: { level: [2, 3], label: '目录' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/doc1' },
      { text: 'Archives', link: '/pages/archives' },
      { text: 'Tags', link: '/pages/tags' }
    ],
    sidebar: {
      '/docs': [
        {
          text: 'Docs',
          items: [
            { text: 'Doc 1', link: '/docs/doc1' },
            { text: 'Doc 2', link: '/docs/doc2' },
            { text: 'Doc 3', link: '/docs/doc3' },
            { text: 'Doc 4', link: '/docs/doc4' },
            { text: 'Doc 5', link: '/docs/doc5' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/izhichao/vitepress-theme-minimalism' }],
    footer: {
      message: `友情链接：<a href="https://xn--4gq62f52gdss.com/#/register?code=dHfuMweo">一元机场</a>&nbsp;
      <a href="https://bwh81.net/aff.php?aff=46644">搬瓦工</a>&nbsp;
      <a href="https://my.racknerd.com/aff.php?aff=6884">RackNerd</a>&nbsp;
      <a href="https://vps.hosting/?affid=816">V.PS</a>`,
      copyright:
        'Theme by <a href="https://github.com/izhichao/vitepress-theme-minimalism">Minimalism</a> | Copyright © 2017-2023 <a href="https://github.com/izhichao">只抄</a>'
    },
    search: { provider: 'local' }
  },
  markdown: {
    theme: 'dark-plus',
    lineNumbers: true
  },
  srcExclude: ['README.md']
});
