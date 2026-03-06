<template>
  <div class="copyright-info">
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
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

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
.copyright-info {
  padding: 16px 20px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 1rem;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

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
    width: 60px; /* 对齐标签，如果要自适应则设为 auto */
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

// 响应式设计
@media (max-width: 768px) {
  .copyright-info {
    &__item {
      font-size: 13px;
    }
  }
}
</style>
