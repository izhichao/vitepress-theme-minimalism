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
  pinned: boolean;
  tags?: string[];
  excerpt: string;
}

export interface IPage {
  max?: number;
  pinned?: string;
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

export interface IAdsense {
  client?: String;
  'page-top'?: String;
  'page-bottom'?: String;
  'sidebar-nav-before'?: String;
  'sidebar-nav-after'?: String;
  'aside-outline-before'?: String;
  'aside-outline-after'?: String;
  'doc-before'?: String;
  'doc-after'?: String;
}

export interface ITag {
  [key: string]: IPost[];
}

export interface IArchive {
  year: string;
  data: IPost[];
}

export interface ThemeConfig extends DefaultTheme.Config {
  posts: IPost[];
  page?: IPage;
  comment?: ICommnet;
  adsense?: IAdsense;
}
