<template>
  <div class="main-container">
    <div class="main-content">
      <div v-for="post in posts" :key="post.title" class="post">
        <div>
          <div class="post__title">
            <span class="post__pinned" v-if="post.pinned">{{ pinned }}</span>
            <a :href="withBase(post.path)">{{ post.title }}</a>
          </div>
          <div class="post__excerpt" v-if="post.excerpt">{{ post.excerpt }}</div>
        </div>
        <div>
          <span class="iconfont">&#xe7eb;</span>
          <span class="post__date">{{ post.date }}</span>
          <span class="iconfont" v-if="post.tags">&#xe869;</span>
          <a :href="withBase(`/pages/tags.html?tag=${item.replaceAll('&','%26')}`)" v-for="item in post.tags" class="post__tag">
            {{ item }}
          </a>
        </div>
      </div>

      <div class="pagination">
        <a
          class="pagination__link iconfont"
          :href="withBase(index ? '/index.html' : '/page-1.html')"
          v-if="pageTotal > pageMax"
        >
          &#xe86a;
        </a>
        <a
          class="pagination__link"
          v-for="page in pages"
          :key="page"
          :href="withBase(page === 1 && index ? '/index.html' : `/page-${page}.html`)"
          :class="{ 'pagination__link--active': pageCurrent === page }"
        >
          {{ page }}
        </a>
        <a class="pagination__link iconfont" :href="withBase(`/page-${pageTotal}.html`)" v-if="pageTotal > pageMax">
          &#xe86b;
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { withBase } from 'vitepress';
import { IPost } from '../types';
const props = defineProps({
  posts: Array<IPost>,
  pageCurrent: Number,
  pageTotal: Number,
  pageMax: Number,
  pinned: String,
  index: Boolean
});

const pages = ref(findNeighbors(props.pageCurrent, props.pageTotal, props.pageMax));

function findNeighbors(target: number, total: number, max: number) {
  const result: number[] = [];
  const half = Math.floor(max / 2);

  if (total < max) {
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
    return result;
  }

  for (let i = target - half; i <= target + half; i++) {
    if (i >= 1 && i <= total) {
      result.push(i);
    }
  }

  while (result.length < max) {
    const first = result[0];
    const last = result[result.length - 1];

    if (first > 1) {
      result.unshift(first - 1);
    } else if (last < total) {
      result.push(last + 1);
    } else {
      break;
    }
  }
  return result;
}
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.iconfont {
  vertical-align: bottom;
  margin-right: 6px;
}

.post {
  padding: 14px 0;
  border-bottom: 1px dashed #ccc;

  &__pinned {
    color: crimson;
    margin-right: 4px;
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

  &__excerpt {
    color: var(--vp-c-text-2);
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date {
    font-size: 14px;
    margin-right: 10px;
  }

  &__tag {
    font-size: 14px;
    display: inline-block;
    padding: 0 8px;
    border-radius: 2px;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-1);
    transition: 0.4s;

    &:nth-of-type(1) {
      margin-left: 2px;
    }

    &:not(:nth-of-type(1)) {
      margin-left: 8px;
    }

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
    line-height: 34px;
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
