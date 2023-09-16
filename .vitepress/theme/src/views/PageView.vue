<template>
  <div class="main-container">
    <div class="main-content">
      <div v-for="post in posts" :key="post.title" class="post">
        <div class="post__header">
          <div class="post__title">
            <a :href="withBase(post.path)">{{ post.title }}</a>
          </div>
        </div>
        <div class="post__content">
          <span class="post__date">{{ post.date }}</span>
          <a :href="withBase(`/pages/tags.html?tag=${item}`)" v-for="item in post.tags" class="post__tag">
            {{ item }}
          </a>
        </div>
      </div>

      <div class="pagination">
        <a
          class="pagination__link"
          v-for="page in pageTotal"
          :key="page"
          :href="withBase(page === 1 ? '/index.html' : `/page${page}.html`)"
          :class="{ 'pagination__link--active': pageCurrent === page }"
        >
          {{ page }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress';
import { IPost } from '../types';
defineProps({
  posts: Array<IPost>,
  pageCurrent: Number,
  pageTotal: Number
});
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.post {
  padding: 14px 0;
  border-bottom: 1px dashed #ccc;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 8px;

    a {
      color: var(--vp-c-text-1);

      &:hover {
        color: var(--vp-c-brand);
      }
    }
  }

  &__date,
  &__tag {
    font-size: 14px;
  }

  &__tag {
    display: inline-block;
    padding: 0 8px;
    border-radius: 2px;
    margin-left: 10px;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-1);
    transition: 0.4s;

    &:hover {
      color: var(--vp-c-brand);
      background-color: var(--vp-c-gutter);
    }
  }
}

.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;

  &__link {
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px var(--vp-c-divider) solid;
    margin: 0 0.2rem;
    font-weight: 400;
    transition: color 0.3s, background 0.5s, border 0.5s;
    color: var(--vp-c-text-1);

    &:hover,
    &--active {
      color: var(--vp-c-bg-soft);
      background: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-text-1);
    }
  }
}

@media screen and (max-width: 768px) {
  .post {
    &__title {
      font-size: 1.0625rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
