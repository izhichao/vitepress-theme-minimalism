import { DefaultTheme } from 'vitepress/theme';
import { HeadConfig } from 'vitepress';

export interface IPostsConfig {
  pageSize?: number;
  homepage?: boolean;
  srcDir?: string;
  outDir?: string;
  lang?: string;
  excerpt?: number;
  permalink?: string;
  nav?: boolean;
  slot?: string;
  custom?: string;
  postCount?: number;
}

export interface IPost {
  id: string;
  title: string;
  datetime: string;
  permalink: string;
  order?: number;
  pinned?: string;
  password?: string;
  hidden?: boolean;
  draft?: boolean;
  description?: string;
  category?: string;
  tags?: string[];
  head?: HeadConfig[];
  prev?: { text?: string; link?: string };
  next?: { text?: string; link?: string };
}

export interface IPage {
  max?: number;
  pinned?: string;
  outDir?: string;
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

export interface IPostObject {
  [key: string]: IPost[];
}

export interface ThemeConfig extends DefaultTheme.Config {
  posts?: IPost[];
  page?: IPage;
  transition?: boolean;
}
