# 一个极简的 VitePress 博客主题

## 介绍

基于 VitePress 默认主题拓展了引导页、文章列表页、文章页、归档页、标签页，可以与默认主题的文档模式 (带 Sidebar) 完全兼容。

[演示站1](https://zhichao.org) | [演示站2](https://link.zhichao.org/vitepress) | [使用文档](https://zhichao.org/posts/minimalism.html)

## 功能

- 归档页
- 标签页
- 分类页
- 永久链接
- 文章摘要 `<!--more-->`
- 文章置顶
- 上一页 / 下一页
- 图片缩放

以下功能不再集成，无法通过 `themeConfig` 配置，有需要的可以通过[**布局插槽**](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)自行使用

- ~~评论（基于 Waline）~~
- ~~自定义广告 / Adsense~~

## 主页

>  主题提供了两种主页模式

1. 文章列表作为主页（参考[演示站1](https://zhichao.org)）

![vitepress-theme-minimalism1](https://minio.zhichao.org/images/vitepress-theme-minimalism1.webp)

2. 引导页作为主页（参考[演示站2](https://link.zhichao.org/vitepress)）

![vitepress-theme-minimalism2](https://minio.zhichao.org/images/vitepress-theme-minimalism2.webp)

## 感谢

- [vitepress](https://github.com/vuejs/vitepress) - 继承默认主题
- [vuepress](https://github.com/vuejs/vuepress) - 参考首页样式
- [Allow images to be zoomed in on click](https://github.com/vuejs/vitepress/issues/854) - 参考图片缩放
- [vitepress-blog-demo](https://github.com/brc-dd/vitepress-blog-demo) - 参考文章读取与摘要功能
- [vitepress-blog-pure](https://github.com/airene/vitepress-blog-pure) - 参考博客样式
- [waline](https://github.com/walinejs/waline) - 评论系统