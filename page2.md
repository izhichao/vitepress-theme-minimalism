---
title: 第2页
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(9,18)
</script>
<Page :posts="posts" :pageCurrent="2" :pageTotal="2" />