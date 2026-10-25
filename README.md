<div align="center">

# 🎨 VitePress Theme Minimalism

**一个极简、现代、优雅的 VitePress 博客主题**

[✨ 演示站](https://tsx.dpdns.org) | [📖 使用文档](https://zhichao.org/vitepress/overview)

</div>

---

> [!NOTE]
> 1.本主题下的所有功能主要用于满足个人需求，因此在升级过程中可能会引入较多 Breaking Changes
> 
> 2.喜欢**旧版**样式的可以克隆 v0 分支

## 📖 简介

**VitePress Theme Minimalism** 是一个基于 VitePress 默认主题开发的极简博客主题，专注于内容展示与阅读体验。它完美融合了博客模式与文档模式，让你可以在同一个站点中同时拥有博客和文档功能。

## ✨ 功能特性

### ✨ 特点

- 🎯 **极简设计** - 专注内容，去除冗余元素
- 🔌 **完全兼容** - 与 VitePress 默认主题无缝集成
- 🎨 **现代化 UI** - 使用 Geist 字体，视觉体验出色
- 🛠️ **易于定制** - 灵活的配置选项

### 📝 博客功能

- ✅ **文章列表** - 优雅的文章展示页面
- ✅ **文章摘要** - 使用 `<!--more-->` 标记摘要
- ✅ **文章置顶** - 重要文章置顶显示
- ✅ **永久链接** - SEO 友好的 URL 结构
- ✅ **分类系统** - 支持文章分类管理
- ✅ **标签系统** - 多标签文章组织
- ✅ **归档页面** - 按时间线展示所有文章
- ✅ **分页导航** - 上一页 / 下一页导航
- ✅ **图片缩放** - 点击图片放大查看
- ✅ **隐藏文章** - 支持将文章从文章列表中隐藏
- ✅ **密码保护** - 支持文章密码保护
- ✅ **进度条** - 页面加载进度提示

### 🔧 扩展性

通过 [**布局插槽**](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots) 可以轻松扩展以下功能：

- 💬 评论系统（支持 Waline 等）
- 📢 广告位 / Adsense

## 🎨 主题展示

### 📄 主页模式 1：文章列表

将文章列表作为首页，适合纯博客站点。

![文章列表模式](https://s3.zhichao.org/images/vitepress-theme-minimalism-v1.webp)

**特点：**
- 📌 置顶文章高亮显示
- 🏷️ 分类和标签快速导航
- 📅 文章发布时间显示
- 📄 文章摘要预览

### 🏠 主页模式 2：引导页

使用引导页作为首页，适合个人主页。

![引导页模式](https://s3.zhichao.org/images/vitepress-theme-minimalism-index.webp)

**特点：**

- 🖼️ 自定义头像
- 📝 个人简介展示
- 🔗 超链接

## 🎯 使用指南

1. 在 `/posts/` 目录下创建 `.md` 文件
2. 添加 Front Matter 配置
3. 编写文章内容

```markdown
---
draft: true
deleted: true
hidden: true
order: 1
pinned: '置顶'
index: true
password: minimalism
id: minimalism
title: VitePress Theme Minimalism 使用文档   
datetime: '2024/01/01 10:00:00'
permalink: /posts/minimalism
outline: deep
description: '自定义摘要内容'
category: 分类 A
tags: 
  - 标签 A
  - 标签 B
head:
  - - meta
    - name: robots
      content: 'noindex, nofollow'
---

这是文章摘要部分。

<!--more-->

这是文章的详细内容...
```

## 🙏 致谢

感谢以下开源项目的启发：

| 项目 | 说明 |
|------|------|
| [VitePress](https://github.com/vuejs/vitepress) | 继承默认主题 |
| [VuePress](https://github.com/vuejs/vuepress) | 参考首页样式 |
| [vitepress-blog-demo](https://github.com/brc-dd/vitepress-blog-demo) | 参考文章读取与摘要功能 |
| [vitepress-blog-pure](https://github.com/airene/vitepress-blog-pure) | 参考博客样式 |
| [Waline](https://github.com/walinejs/waline) | 评论系统 |
| [lumen](https://github.com/s-theo/lumen) | 分享功能 |
| [VitePress 添加图片查看器 Fancybox](https://note.weizwz.com/vitepress/extend/vitepress-fancybox) | 集成 Fancybox |