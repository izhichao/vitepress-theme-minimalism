<template>
  <div class="post-info" v-if="$frontmatter.datetime">
    <!-- 第一行：发布于、更新于（左），浏览（右） -->
    <div class="post-info__row post-info__row--primary">
      <div class="post-info__group post-info__group--left">
        <!-- 发布于 -->
        <div class="post-info__item">
          <Icon class="post-info__icon" icon="mingcute:calendar-line" />
          <span class="post-info__label">发布于</span>
          <span class="post-info__value">{{ formatDate($frontmatter.datetime) }}</span>
        </div>

        <!-- 更新于 -->
        <div class="post-info__item" v-if="page.lastUpdated">
          <Icon class="post-info__icon" icon="mingcute:time-line" />
          <span class="post-info__label">更新于</span>
          <span class="post-info__value">{{ formatDate(page.lastUpdated) }}</span>
        </div>
      </div>

      <!-- 浏览量 -->
      <div class="post-info__group post-info__group--right" v-if="$frontmatter.views">
        <div class="post-info__item">
          <Icon class="post-info__icon" icon="mingcute:eye-line" />
          <span class="post-info__label">浏览</span>
          <span class="post-info__value">{{ $frontmatter.views }}</span>
        </div>
      </div>
    </div>

    <!-- 第二行：分类、标签 -->
    <div
      class="post-info__row post-info__row--secondary"
      v-if="$frontmatter.category || ($frontmatter.tags && $frontmatter.tags.length > 0)"
    >
      <!-- 分类 -->
      <div class="post-info__category" v-if="$frontmatter.category">
        <Icon class="post-info__icon" icon="mingcute:folder-line" />
        <span class="post-info__label">分类</span>
        <a
          :href="withBase(`${outDir}/category.html?category=${$frontmatter.category.replaceAll('&', '%26')}`)"
          class="post-info__badge post-info__badge--category"
        >
          {{ $frontmatter.category }}
        </a>
      </div>

      <!-- 标签 -->
      <div class="post-info__tags" v-if="$frontmatter.tags && $frontmatter.tags.length > 0">
        <Icon class="post-info__icon" icon="mingcute:tag-line" />
        <span class="post-info__label">标签</span>
        <div class="post-info__tags-list">
          <a
            v-for="tag in $frontmatter.tags"
            :key="tag"
            :href="withBase(`${outDir}/category.html?tag=${tag.replaceAll('&', '%26')}`)"
            class="post-info__badge post-info__badge--tag"
          >
            {{ tag }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress';
import { useOutDir } from '../composables/useOutDir';
import { Icon } from '@iconify/vue';

const { outDir } = useOutDir();
const { page } = useData();

function formatDate(datetime: string): string {
  if (!datetime) return '';
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}
</script>

<style lang="less" scoped>
.post-info {
  padding: 16px 20px;
  background-color: var(--vp-c-bg-soft);
  // border-radius: 4px;
  border: 1px solid var(--vp-c-gray-1);
  border-left: 0;
  border-right: 0;
  margin: 20px 0;

  // 行容器
  &__row {
    display: flex;
    align-items: center;

    // 第一行
    &--primary {
      justify-content: space-between;
    }

    // 第二行
    &--secondary {
      gap: 20px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
  }

  // 组容器
  &__group {
    display: flex;
    align-items: center;

    &--left {
      gap: 20px;
      flex-wrap: wrap;
    }

    &--right {
      // 浏览量靠右
    }
  }

  // 信息项
  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--vp-c-text-2);
  }

  // 图标
  &__icon {
    width: 16px;
    height: 16px;
    color: var(--vp-c-text-3);
    flex-shrink: 0;
  }

  // 标签文本
  &__label {
    color: var(--vp-c-text-3);
    font-weight: 400;
    font-size: 14px;
    flex-shrink: 0;
  }

  // 值文本
  &__value {
    color: var(--vp-c-text-1);
    font-weight: 500;
  }

  // 分类容器
  &__category {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  // 标签容器
  &__tags {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  // 标签列表
  &__tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  // 徽章通用样式
  &__badge {
    display: inline-block;
    padding: 0.075rem 0.625rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;

    // 分类徽章
    &--category {
      background-color: var(--vp-c-gray-2);

      &:hover {
        background-color: var(--vp-c-brand-soft);
        text-decoration: none;
      }
    }

    // 标签徽章
    &--tag {
      border-radius: 9999px;
      background-color: var(--vp-c-bg);
      border: 1px solid var(--vp-c-divider);

      &:hover {
        background-color: var(--vp-c-brand-soft);
        border-color: var(--vp-c-brand);
        text-decoration: none;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .post-info {
    &__row {
      &--primary {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      &--secondary {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }

    &__group {
      &--left {
        gap: 12px;
      }
    }

    &__item {
      font-size: 13px;
    }

    &__badge {
      font-size: 12px;
      padding: 3px 12px;
    }
  }
}
</style>
