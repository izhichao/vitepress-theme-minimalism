<template>
  <nav class="prev-next" v-if="prevNext.prev || prevNext.next">
    <!-- 上一篇 -->
    <div class="prev-next__slot prev-next__slot--prev">
      <a v-if="prevNext.prev" :href="withBase(prevNext.prev.link)" class="prev-next__card prev-next__card--prev">
        <span class="prev-next__label">
          <svg class="prev-next__arrow" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.293 1.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L11.586 9H2a1 1 0 010-2h9.586L7.293 2.707a1 1 0 010-1.414z"
              fill="currentColor"
              transform="rotate(180 8 8)"
            />
          </svg>
          {{ props.prevText }}
        </span>
        <span class="prev-next__title">{{ prevNext.prev.text }}</span>
      </a>
    </div>

    <!-- 下一篇 -->
    <div class="prev-next__slot prev-next__slot--next">
      <a v-if="prevNext.next" :href="withBase(prevNext.next.link)" class="prev-next__card prev-next__card--next">
        <span class="prev-next__label">
          {{ props.nextText }}
          <svg class="prev-next__arrow" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.293 1.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L11.586 9H2a1 1 0 010-2h9.586L7.293 2.707a1 1 0 010-1.414z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span class="prev-next__title">{{ prevNext.next.text }}</span>
      </a>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { IPost } from '../types';

const props = withDefaults(
  defineProps<{
    prevText?: string;
    nextText?: string;
    showPinned?: boolean;
  }>(),
  {
    prevText: '上一篇',
    nextText: '下一篇',
    showPinned: true
  }
);

const { theme, frontmatter } = useData();
const allPosts: IPost[] = theme.value.posts || [];

const prevNext = computed(() => {
  const posts = props.showPinned ? allPosts : allPosts.filter((post) => !post.order);

  const index = posts.findIndex((post) => post.id === frontmatter.value.id);
  if (index === -1) return { prev: null, next: null };

  const prevPost = posts[index - 1] || null;
  const nextPost = posts[index + 1] || null;

  return {
    prev: prevPost ? { text: prevPost.title, link: prevPost.permalink } : null,
    next: nextPost ? { text: nextPost.title, link: nextPost.permalink } : null
  };
});
</script>

<style lang="less" scoped>
.prev-next {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);

  // ── 占位槽：始终渲染，保证左右各占50% ──────────────────────
  &__slot {
    flex: 0 0 calc(50% - 0.5rem);
    display: flex;

    &--prev {
      justify-content: flex-start;
    }

    &--next {
      justify-content: flex-end;
    }
  }

  // ── 卡片：可交互的链接本体 ──────────────────────────────────
  &__card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 1rem 1.25rem;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.75rem;
    text-decoration: none;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      background-color: var(--vp-c-bg-elv);
      border-color: var(--vp-c-text-3);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      text-decoration: none;
    }

    &--prev {
      align-items: flex-start;
    }

    &--next {
      align-items: flex-end;
    }
  }

  // ── 方向标签（"上一篇" / "下一篇" + 箭头图标） ─────────────
  &__label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--vp-c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;

    .prev-next__card:hover & {
      color: var(--vp-c-text-1);
    }
  }

  // ── 箭头图标 ────────────────────────────────────────────────
  &__arrow {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    .prev-next__card--prev:hover & {
      transform: translateX(-3px);
    }

    .prev-next__card--next:hover & {
      transform: translateX(3px);
    }
  }

  // ── 文章标题 ────────────────────────────────────────────────
  &__title {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s ease;

    .prev-next__card--next & {
      text-align: right;
    }
  }
}

// ── 响应式：移动端垂直堆叠 ─────────────────────────────────────
@media (max-width: 640px) {
  .prev-next {
    flex-direction: column;
    gap: 0.75rem;

    &__slot {
      flex: none;
      width: 100%;

      // 空 slot 退出 flex 流，避免 gap 产生多余空白
      &:not(:has(> a)) {
        display: none;
      }
    }

    &__card {
      &--next {
        align-items: flex-start;
      }
    }

    &__label {
      .prev-next__card--next & {
        flex-direction: row-reverse;
      }
    }

    &__title {
      .prev-next__card--next & {
        text-align: left;
      }
    }
  }
}
</style>
