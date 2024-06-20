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

export interface IAd {
  title: string;
  img: string;
  link?: string;
}

export interface IAds {
  'page-top'?: (IAd | IAd[])[];
  'page-bottom'?: (IAd | IAd[])[];
  'sidebar-nav-before'?: (IAd | IAd[])[];
  'sidebar-nav-after'?: (IAd | IAd[])[];
  'aside-outline-before'?: (IAd | IAd[])[];
  'aside-outline-after'?: (IAd | IAd[])[];
  'doc-before'?: (IAd | IAd[])[];
  'doc-after'?: (IAd | IAd[])[];
}

export interface IAdsense {
  client?: string;
  'page-top'?: string;
  'page-bottom'?: string;
  'sidebar-nav-before'?: string;
  'sidebar-nav-after'?: string;
  'aside-outline-before'?: string;
  'aside-outline-after'?: string;
  'doc-before'?: string;
  'doc-after'?: string;
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
  ads?: IAds;
  adsense?: IAdsense;
}
