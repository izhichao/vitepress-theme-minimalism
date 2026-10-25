import type { SlotBinding, PageTarget } from '../types.ts';

/**
 * 依据当前页面类型解析对应的插槽组件名
 * @param binding 用户在 themeConfig.slots 中配置的 SlotBinding
 * @param target 当前页面类型 ('page' | 'category' | 'tags' | 'archives')
 */
export function resolveSlot(binding?: SlotBinding, target?: PageTarget): string | undefined {
  if (!binding) return undefined;
  if (typeof binding === 'string') return binding;
  return (target && binding[target]) || binding.default;
}
