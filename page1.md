---
title: 第1页
layout: page
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(0,7)
</script>
<Page :posts="posts" :pageCurrent="1" :pageTotal="2" :index="false" />