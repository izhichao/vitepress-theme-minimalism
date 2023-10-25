import { defineConfigWithTheme } from 'vitepress';
import { ThemeConfig } from './theme/src/types';
import { getPosts } from './theme/src/utils/getPosts';

const { posts, rewrites } = await getPosts({ pageSize: 7, pageMax: 5, index: false,pinned: '[置顶]', folder: 'posts' });
export default defineConfigWithTheme<ThemeConfig>({
  title: '只抄',
  titleTemplate: 'VitePress Theme Minimalism',
  description: 'VitePress Theme Minimalism',
  base: '/vitepress-theme-minimalism/',
  rewrites,
  themeConfig: {
    posts,
    logo: '/profile.png',
    outline: { level: 2 },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/page1' },
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
      message: `友情链接：<a href="https://bwh81.net/aff.php?aff=46644" target="_blank">搬瓦工</a>&nbsp;
      <a href="https://vps.hosting/?affid=816" target="_blank">V.PS</a>&nbsp;
      <a href="https://justmysocks5.net/members/aff.php?aff=28608" target="_blank">Just My Socks</a><br />
      Theme by <a href="https://github.com/izhichao/vitepress-theme-minimalism" target="_blank">Minimalism</a>`,
      copyright: 'Copyright © 2017-2023 <a href="https://github.com/izhichao" target="_blank">只抄</a>'
    },
    search: { provider: 'local' }
  },
  markdown: {
    theme: 'dark-plus',
    lineNumbers: true
  },
  srcExclude: ['README.md', 'README_zh-CN.md']
});
