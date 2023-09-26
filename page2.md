---
title: 第2页
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(6,12)
</script>
<Page :posts="posts" :pageCurrent="2" :pageTotal="2" :index="false" />