import { DefaultTheme } from 'vitepress/theme';

export interface IPostsConfig {
  pageSize?: number;
  homepage?: boolean;
  srcDir?: string;
  outDir?: string;
  lang?: string;
  autoExcerpt?: number;
  prev?: boolean;
  next?: boolean;
  slot?: string;
  custom?: string;
  postCount?: number;
}

export interface IPost {
  title: string;
  datetime: string;
  permalink: string;
  order: number;
  pinned: boolean;
  display?: 'none';
  desc?: string;
  category?: string;
  tags?: string[];
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
}
