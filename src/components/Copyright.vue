<template>
  <div class="copyright-info-wrapper">
    <div class="copyright-info">
      <div class="copyright-info__content">
        <div class="copyright-info__item">
          <Icon class="copyright-info__icon" icon="mingcute:user-3-line" />
          <span class="copyright-info__label">本文作者</span>
          <span class="copyright-info__value">
            <a :href="host" class="copyright-info__link">{{ author }}</a>
          </span>
        </div>
        <div class="copyright-info__item">
          <Icon class="copyright-info__icon" icon="mingcute:document-line" />
          <span class="copyright-info__label">本文标题</span>
          <span class="copyright-info__value">{{ articleTitle }}</span>
        </div>
        <div class="copyright-info__item">
          <Icon class="copyright-info__icon" icon="mingcute:link-line" />
          <span class="copyright-info__label">本文链接</span>
          <span class="copyright-info__value">
            <a :href="url" target="_blank" rel="noopener noreferrer" class="copyright-info__link">{{ url }}</a>
          </span>
        </div>
        <div class="copyright-info__item">
          <Icon class="copyright-info__icon" icon="mingcute:copyright-line" />
          <span class="copyright-info__label">版权声明</span>
          <span class="copyright-info__value">
            本博客所有文章除特别声明外，均采用
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" class="copyright-info__link">
              CC BY-NC-SA 4.0
            </a>
            许可协议。转载请注明出处！
          </span>
        </div>
      </div>

      <div v-if="$slots.default || img" class="copyright-info__extra">
        <slot>
          <a
            v-if="img && link"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="copyright-info__extra-link"
          >
            <img
              class="copyright-info__extra-img"
              :src="img"
              :alt="title || ''"
              :title="title"
            />
          </a>
          <img
            v-else-if="img"
            class="copyright-info__extra-img"
            :src="img"
            :alt="title || ''"
            :title="title"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  img?: string;
  link?: string;
  title?: string;
}>();

const { site, page } = useData();
const route = useRoute();

// 从 config.ts 中获取站点标题作为作者
const author = computed(() => site.value.title);
const articleTitle = computed(() => page.value.title);

const url = ref('');
const host = ref('');

// 提取公共的更新 URL 函数
const updateUrl = () => {
  if (typeof window !== 'undefined') {
    const urlObj = new URL(window.location.href);
    url.value = urlObj.origin + urlObj.pathname;
    host.value = urlObj.origin + site.value.base;
  }
};

// 1. 初次客户端挂载时执行
onMounted(updateUrl);

// 2. 路由切换时执行
watch(
  () => route.path,
  () => nextTick(updateUrl)
);
</script>

<style lang="less" scoped>
.copyright-info-wrapper {
  container-type: inline-size;
  margin: 20px 0;
}

.copyright-info {
  padding: 0 20px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  // 信息内容区：上下 16px padding
  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  }

  // 右侧展示区：无上下 padding，限制 max-height: 138px
  &__extra {
    flex-shrink: 0;
    max-height: 138px;
    display: flex;
    align-items: center;
    justify-content: center;

    // 穿透给插槽根元素：保证任意组件/容器不超出 138px 高度
    :deep(> *) {
      max-height: 138px;
      max-width: 100%;
    }

    // 穿透给内部图片（包括插槽内的图片），重置 VitePress 默认文章图片的 margin 和 shadow
    :deep(img) {
      max-height: 138px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      display: block;
      border-radius: 0.5rem;
      margin: 0 !important;
      box-shadow: none !important;
    }
  }

  &__extra-link {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: inherit;
    text-decoration: none;
  }

  // 信息项
  &__item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    color: var(--vp-c-text-2);
    line-height: 1.6;
  }

  // 图标
  &__icon {
    width: 16px;
    height: 16px;
    color: var(--vp-c-text-3);
    flex-shrink: 0;
    margin-top: 3px;
  }

  // 标签文本
  &__label {
    color: var(--vp-c-text-3);
    font-weight: 400;
    flex-shrink: 0;
    width: 60px;
    /* 对齐标签，如果要自适应则设为 auto */
  }

  // 值文本
  &__value {
    color: var(--vp-c-text-1);
    font-weight: 500;
    word-break: break-all;
  }

  // 链接
  &__link {
    color: var(--vp-c-brand-1);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.25s;

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}

// 页面收窄（容器查询）：直接隐藏右侧
@container (max-width: 580px) {
  .copyright-info {
    &__extra {
      display: none;
    }
  }
}

// 移动端/窄视口：隐藏右侧，字体设为 13px（和原来一样）
@media (max-width: 768px) {
  .copyright-info {
    &__extra {
      display: none;
    }

    &__item {
      font-size: 13px;
    }
  }
}
</style>
