import { defineConfigWithTheme } from 'vitepress';
import { usePosts } from '../src/composables/usePosts';
import type { ThemeConfig } from '../src/types';

const { posts, rewrites } = await usePosts({
  pageSize: 7,
  index: false,
  folder: 'posts',
  autoExcerpt: 50,
  prev: true,
  next: true
});

export default defineConfigWithTheme<ThemeConfig>({
  title: '只抄',
  titleTemplate: 'VitePress Theme Minimalism',
  description: 'VitePress Theme Minimalism',
  rewrites,
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    posts,
    page: {
      max: 5,
      pinned: '[置顶]'
    },
    comment: {
      serverURL: 'https://domain.com',
      reaction: true
    },
    ads: {
      asideOutlineAfter: [
        {
          title: 'ouo.io - 縮短網址也可以賺錢',
          img: 'https://ouo.io/images/banners/r5.jpg',
          link: 'http://ouo.io/ref/QQbUaFAo'
        }
      ],
      sidebarNavAfter: [
        {
          title: 'ouo.io - 縮短網址也可以賺錢',
          img: 'https://ouo.io/images/banners/r5.jpg',
          link: 'http://ouo.io/ref/QQbUaFAo'
        }
      ],
      docAfter: [
        {
          title: 'ouo.io - 縮短網址也可以賺錢',
          img: 'https://ouo.io/images/banners/r1.jpg',
          link: 'http://ouo.io/ref/QQbUaFAo'
        }
      ]
    },
    logo: '/profile.png',
    outline: { level: 2 },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/page-1' },
      { text: 'Docs', link: '/docs/doc1' },
      { text: 'Category', link: '/category' },
      { text: 'Archives', link: '/archives' },
      { text: 'Tags', link: '/tags' }
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
      <a href="https://my.racknerd.com/aff.php?aff=6884" target="_blank">RackNerd</a>
      `,
      copyright: `Theme by <a href="https://github.com/izhichao/vitepress-theme-minimalism" target="_blank">Minimalism</a><br />
        Copyright © 2017-2024 <a href="https://github.com/izhichao" target="_blank">只抄</a>`
    },
    search: { provider: 'local' }
  },
  markdown: {
    theme: 'dark-plus',
    lineNumbers: true
  },
  srcExclude: ['README.md', 'README_en-US.md']
});
