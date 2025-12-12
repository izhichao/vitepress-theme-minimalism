<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <slot name="doc-before"></slot>
      <template v-for="(value, key) in posts">
        <div class="title">{{ key === 'category' ? '分类' : '标签' }}</div>
        <TabList
          @change="(tab) => handleChange(tab, key)"
          :type="key"
          :tabs="tabs[key]"
          :selected="currentType === key ? select : null"
          :posts="value"
        />
      </template>

      <div v-show="select" class="title">
        {{ currentType === 'category' ? '分类：' : '标签：' }}{{ select }}
      </div>

      <PostList :posts="posts[currentType][select]" :showPinned="false" />

      <slot name="doc-after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useData } from 'vitepress';
import TabList from '../components/TabList.vue';
import PostList from '../components/PostList.vue';
import { addToData } from '../utils/addToData';
import { sortPostsByTime } from '../utils/sortPostsByTime';
import { IPost } from '../types';

const useFilter = (posts: IPost[]) => {
  const filterPosts = {
    category: {},
    tag: {}
  };

  const tabs = {
    category: [],
    tag: []
  };

  posts.forEach((post) => {
    const category = post.category;
    const tags = post.tags;

    addToData(filterPosts.category, category, post);
    tags && tags.forEach((tag) => addToData(filterPosts.tag, tag, post));
  });

  tabs.category = Object.keys(filterPosts.category).sort((a, b) => a.localeCompare(b));
  tabs.tag = Object.keys(filterPosts.tag).sort((a, b) => a.localeCompare(b));

  return { tabs, posts: filterPosts };
};

const { theme } = useData();
// 先按时间排序，再传入分类过滤函数
const sortedPosts = sortPostsByTime(theme.value?.posts || []);
const { tabs, posts } = useFilter(sortedPosts);

// 初始化状态
const select = ref('');
const currentType = ref<'category' | 'tag'>('category');
let baseUrl = '/';

// 在客户端挂载时初始化 URL 相关逻辑
onMounted(() => {
  if (typeof window === 'undefined') return;

  baseUrl = location.href.split('?')[0];
  const search = location.href.split('?')[1];
  const params = new URLSearchParams(search);

  // 确定初始类型和选中值
  const initCategory = params.get('category');
  const initTag = params.get('tag');
  select.value = initCategory || initTag || '';
  currentType.value = initCategory ? 'category' : 'tag';
});

const handleChange = (tab: string, type: 'category' | 'tag') => {
  select.value = tab;
  currentType.value = type;
  if (typeof window !== 'undefined') {
    const newUrl = `${baseUrl}?${type}=${tab.replaceAll('&', '%26')}`;
    window.history.replaceState(null, '', newUrl);
  }
};
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.25rem;
  padding: 32px 0 18px;
  font-family: var(--font-family-number);
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>
