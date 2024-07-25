import { defineConfigWithTheme } from 'vitepress';
import { usePosts } from '../src/composables/usePosts';
import type { ThemeConfig } from '../src/types';

const { posts, rewrites } = await usePosts({
  pageSize: 7,
  index: false,
  srcDir: 'posts',
  autoExcerpt: 50
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
          title: '关注微信公众号',
          img: 'https://minio.zhichao.org/assets/wechat.png'
        }
      ],
      sidebarNavAfter: [
        {
          title: '关注微信公众号',
          img: 'https://minio.zhichao.org/assets/wechat.png'
        }
      ],
      docAfter: [
        [
          {
            title: 'V.PS- 美国 CN2 GIA / 9929 / CMIN2 顶级线路',
            img: 'https://minio.zhichao.org/assets/vps.png',
            link: 'https://vps.hosting/?cmd=cart&action=add&affid=816&id=144'
          },
          {
            title: '搬瓦工 - 美国 CN2 优化线路',
            img: 'https://minio.zhichao.org/assets/bwh.png',
            link: 'https://bwh81.net/aff.php?aff=46644&pid=44'
          },
          {
            title: 'RackNerd - 美国 163 直连线路',
            img: 'https://minio.zhichao.org/assets/rn.png',
            link: 'https://my.racknerd.com/aff.php?aff=6884&pid=810'
          }
        ]
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
      message:
        'Theme by <a href="https://github.com/izhichao/vitepress-theme-minimalism" target="_blank">Minimalism</a>',
      copyright: 'Copyright © 2017-2024 <a href="https://github.com/izhichao" target="_blank">只抄</a>'
    },
    search: { provider: 'local' }
  },
  markdown: {
    theme: 'dark-plus',
    lineNumbers: true
  },
  srcExclude: ['README.md', 'README_en-US.md']
});
