<template>
  <div class="ZCContainer">
    <div class="ZCContent">
      <slot name="doc-before"></slot>

      <template v-if="categoryTabs">
        <div class="title bold">分类</div>
        <TabList
          @change="(tab) => handleChange(tab, 'category')"
          type="category"
          :tabs="categoryTabs"
          :selected="currentType === 'category' ? select : null"
          :posts="categoryPosts"
        />
      </template>
      <template v-if="tagTabs">
        <div class="title bold">标签</div>
        <TabList 
          @change="(tab) => handleChange(tab, 'tags')" 
          type="tags" 
          :tabs="tagTabs" 
          :selected="currentType === 'tags' ? select : null" 
          :posts="tagPosts" 
        />
      </template>

      <div v-show="select" class="title title--last bold">{{ currentType === 'category' ? '分类：' : '标签：' }}{{ select }}</div>
      <PostList v-if="currentType === 'category'" :posts="categoryPosts[select]" type="category" />
      <PostList v-else-if="currentType === 'tags'" :posts="tagPosts[select]" type="category" />

      <slot name="doc-after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useData } from 'vitepress';
import { useFilter } from '../composables/useGroup';
import TabList from '../components/TabList.vue';
import PostList from '../components/PostList.vue';

const { theme } = useData();
const { categoryTabs, categoryPosts, tagTabs, tagPosts } = useFilter(theme.value?.posts || []);

const url = location.href.split('?')[0];
const search = location.href.split('?')[1];
const params = new URLSearchParams(search);

// 确定初始类型和选中值
const initCategory = params.get('category');
const initTag = params.get('tags');
const select = ref(initCategory || initTag || '');
const currentType = ref<'category' | 'tags'>(initCategory ? 'category' : 'tags');

const handleChange = (tab: string, type: 'category' | 'tags') => {
  select.value = tab;
  currentType.value = type;
  const newUrl = `${url}?${type}=${tab.replaceAll('&', '%26')}`;
  window.history.replaceState(null, '', newUrl);
};
</script>

<style lang="less" scoped>
@import '../styles/page.less';
.title {
  font-size: 1.25rem;
  padding: 32px 0 18px;
  font-family: var(--font-family-number);
}

.bold {
  font-weight: 700;
}

@media screen and (max-width: 768px) {
  .bold {
    font-size: 1.5rem;
  }
}
</style>
