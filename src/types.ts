import { DefaultTheme } from 'vitepress/theme';
import {
  WalineLocale,
  WalineEmojiInfo,
  WalineEmojiPresets,
  WalineCommentSorting,
  WalineImageUploader,
  WalineHighlighter,
  WalineTeXRenderer,
  WalineSearchOptions
} from '@waline/client';

export interface IPost {
  title: string;
  datetime: string;
  permalink: string;
  order: number;
  pinned: boolean;
  tags?: string[];
  category?: string;
  excerpt: string;
}

export interface IPage {
  max?: number;
  pinned?: string;
  outDir?: string;
}

export interface ICommnet {
  serverURL?: string;
  lang?: string;
  locale?: WalineLocale;
  emoji?: (WalineEmojiInfo | WalineEmojiPresets)[] | false;
  commentSorting?: WalineCommentSorting;
  meta?: string[];
  requiredMeta?: string[];
  login?: string;
  wordLimit?: number | [number, number];
  pageSize?: number;
  imageUploader?: WalineImageUploader | false;
  highlighter?: WalineHighlighter | false;
  texRenderer?: WalineTeXRenderer | false;
  search?: WalineSearchOptions | false;
  copyright?: boolean;
  recaptchaV3Key?: string;
  turnstileKey?: string;
  reaction?: boolean | string[];
}

export interface IAd {
  title: string;
  img: string;
  link?: string;
}

export interface IAdsense {
  client: string;
  slot: string;
}

export interface IGroup {
  [key: string]: IPost[];
}

export interface ThemeConfig extends DefaultTheme.Config {
  posts?: IPost[];
  page?: IPage;
}
