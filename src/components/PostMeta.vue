<template>
  <div class="post-info" v-if="datetime">
    <!-- 第一行：发布于、更新于（左），浏览（右） -->
    <div class="post-info__row post-info__row--primary">
      <div class="post-info__group post-info__group--left">
        <!-- 发布于 -->
        <div class="post-info__item">
          <Icon class="post-info__icon" icon="mingcute:calendar-line" />
          <span class="post-info__label">{{ isZh ? '发布于' : 'Published' }}</span>
          <span class="post-info__value">{{ formatDate(datetime) }}</span>
        </div>

        <!-- 更新于 -->
        <div class="post-info__item" v-if="lastUpdated">
          <Icon class="post-info__icon" icon="mingcute:time-line" />
          <span class="post-info__label">{{ isZh ? '更新于' : 'Updated' }}</span>
          <span class="post-info__value">{{ formatDate(lastUpdated) }}</span>
        </div>
      </div>

      <!-- 浏览量 -->
      <div class="post-info__group post-info__group--right" v-if="views">
        <div class="post-info__item">
          <Icon class="post-info__icon" icon="mingcute:eye-line" />
          <span class="post-info__label">{{ isZh ? '浏览' : 'Views' }}</span>
          <span class="post-info__value">{{ views }}</span>
        </div>
      </div>
    </div>

    <!-- 第二行：分类、标签 -->
    <div class="post-info__row post-info__row--secondary" v-if="category || (tags && tags.length > 0)">
      <!-- 分类 -->
      <div class="post-info__category" v-if="category">
        <Icon class="post-info__icon" icon="mingcute:folder-line" />
        <span class="post-info__label">{{ isZh ? '分类' : 'Category' }}</span>
        <a :href="withBase(`/category/${encodeURIComponent(category)}`)" class="post-info__badge post-info__badge--category">
          {{ category }}
        </a>
      </div>

      <!-- 标签 -->
      <div class="post-info__tags" v-if="tags && tags.length > 0">
        <Icon class="post-info__icon" icon="mingcute:tag-line" />
        <span class="post-info__label">{{ isZh ? '标签' : 'Tags' }}</span>
        <div class="post-info__tags-list">
          <a v-for="tag in tags" :key="tag" :href="withBase(`/tags/${encodeURIComponent(tag)}`)" class="post-info__badge post-info__badge--tag">
            {{ tag }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { Icon } from '@iconify/vue';

const { page, frontmatter, lang } = useData();
const isZh = computed(() => (lang.value || 'zh').startsWith('zh'));

const { lastUpdated } = page.value;
const { datetime, views, category, tags } = frontmatter.value;

const formatDate = (datetime: string | number) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return isZh.value ? `${year}年${month}月${day}日` : `${year}-${month}-${day}`;
};
</script>

<style lang="less" scoped>
.post-info {
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  border-radius: 1rem;
  margin: 20px 0;

  // 行容器
  &__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    &--primary {
      justify-content: space-between;

      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }

    &--secondary {
      padding-top: 12px;
      border-top: 1px dashed var(--vp-c-divider);
      margin-top: 12px;
    }
  }

  // 组容器
  &__group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    &--left {
      flex: 1;
      min-width: 0;
    }

    // 浏览量靠右
    &--right {
      margin-left: auto;

      @media (max-width: 640px) {
        margin-left: 0;
      }
    }
  }

  // 信息项
  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--vp-c-text-2);
    white-space: nowrap;
  }

  // 图标
  &__icon {
    font-size: 15px;
    color: var(--vp-c-text-3);
    flex-shrink: 0;
  }

  // 标签文本
  &__label {
    color: var(--vp-c-text-3);
    font-size: 12px;
  }

  // 值文本
  &__value {
    color: var(--vp-c-text-2);
    font-weight: 500;
  }

  // 分类容器
  &__category {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }

  // 标签容器
  &__tags {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    flex: 1;
    min-width: 0;
  }

  // 标签列表
  &__tags-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  // 徽章通用样式
  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;

    // 分类徽章
    &--category {
      background-color: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);

      &:hover {
        background-color: var(--vp-c-brand-2);
        color: var(--vp-c-white);
      }
    }

    // 标签徽章
    &--tag {
      background-color: var(--vp-c-default-soft);
      color: var(--vp-c-text-2);

      &:hover {
        background-color: var(--vp-c-brand-soft);
        color: var(--vp-c-brand-1);
      }
    }
  }
}

// 响应式设计
@media (max-width: 640px) {
  .post-info {
    padding: 12px 14px;
    margin: 16px 0;

    &__row {
      gap: 10px;

      &--secondary {
        padding-top: 10px;
        margin-top: 10px;
      }
    }

    &__group {
      gap: 12px;
    }

    &__item {
      font-size: 12px;
    }

    &__icon {
      font-size: 14px;
    }
  }
}
</style>
