<template>
  <div class="post-list">
    <a v-for="post in posts" :key="post.title" :href="withBase(post.permalink)" class="post-item">
      <!-- 标题和分类同一行 -->
      <div class="post-item__header">
        <h2 class="post-item__title">
          <span v-if="post.order && showPinned" class="post-item__pinned">
            <Icon class="post-item__pinned-icon" icon="mingcute:fire-fill" />
            {{ post.pinned || page?.pinned || 'HOT' }}
          </span>
          {{ post.title }}
        </h2>
        <a
          v-if="post.category"
          :href="withBase(`${outDir}/category?category=${post.category.replaceAll('&', '%26')}`)"
          class="post-item__category"
          @click.stop
        >
          {{ post.category }}
        </a>
      </div>

      <!-- 摘要 -->
      <p v-if="post.excerpt" class="post-item__excerpt">
        {{ post.excerpt }}
      </p>

      <!-- 时间和标签同一行 -->
      <div class="post-item__footer">
        <div class="post-item__footer-left">
          <div class="post-item__meta">
            <Icon class="post-item__icon" icon="mingcute:calendar-line" />
            <span class="post-item__date">{{ post.datetime.split(' ')[0] }}</span>
          </div>

          <div v-if="post.tags && post.tags.length" class="post-item__tags">
            <a
              v-for="tag in post.tags"
              :key="tag"
              :href="withBase(`${outDir}/category?tag=${tag.replaceAll('&', '%26')}`)"
              class="post-item__tag"
              @click.stop
            >
              <Icon class="post-item__tag-icon" icon="mingcute:tag-line" />
              {{ tag }}
            </a>
          </div>
        </div>

        <!-- <div class="post-item__views">
          <Icon class="post-item__icon" icon="mingcute:eye-line" />
          <span>{{ Math.floor(Math.random() * 1000) + 100 }} 次浏览</span>
        </div> -->
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress';
import { IPost } from '../types';
import { useOutDir } from '../composables/useOutDir';
import { Icon } from '@iconify/vue';

const { outDir } = useOutDir();
const { theme } = useData();
const page = theme.value.page;

defineProps({
  posts: Array<IPost>,
  showPinned: { type: Boolean, default: true }
});
</script>

<style lang="less" scoped>
.post-list {
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  gap: 1rem;
}

.post-item {
  display: block;
  background-color: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:hover {
    border-color: var(--vp-c-brand-soft);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

    & .post-item__title {
      color: var(--vp-c-brand);
    }

    & .post-item__excerpt {
      color: var(--vp-c-text-1);
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 0.75rem;
  }

  &__title {
    flex: 1;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--vp-c-text-1);
    margin: 0;
    transition: all 0.3s ease;
  }

  &__pinned {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    margin-right: 0.25rem;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand);
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 0.375rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__pinned-icon {
    font-size: 0.875rem;
  }

  &__category {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 0.5rem;
    white-space: nowrap;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: var(--vp-c-brand);
      background-color: var(--vp-c-brand-soft);
    }
  }

  &__excerpt {
    color: var(--vp-c-text-2);
    line-height: 1.6;
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--vp-c-gray-3);
    padding-top: 0.75rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__footer-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__meta,
  &__views {
    display: flex;
    align-items: center;
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
  }

  &__icon {
    margin-right: 0.375rem;
    font-size: 1rem;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    background-color: var(--vp-c-bg);
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 9999px;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--vp-c-brand-soft);
      color: var(--vp-c-brand);
      border-color: var(--vp-c-brand);
      text-decoration: none;
    }
  }

  &__tag-icon {
    font-size: 0.875rem;
  }
}

@media screen and (max-width: 768px) {
  .post-list {
    gap: 0.75rem;
  }

  .post-item {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: flex-start;
    }

    &__title {
      font-size: 1rem;
      line-height: 1.5;
      width: 100%;
    }

    &__pinned {
      vertical-align: -0.125rem;
    }

    &__category {
      padding: 0.125rem 0.5rem;
      font-size: 0.8125rem;
    }

    &__excerpt {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    &__footer {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    &__footer-left {
      width: 100%;
      gap: 0.75rem;
    }

    &__meta,
    &__views {
      font-size: 0.8125rem;
    }

    &__icon {
      font-size: 0.875rem;
    }

    &__views {
      display: none;
    }

    &__tags {
      gap: 0.375rem;
    }

    &__tag {
      padding: 0.25rem 0.5rem;
      font-size: 0.6875rem;
    }

    &__tag-icon {
      font-size: 0.75rem;
    }
  }
}
</style>
