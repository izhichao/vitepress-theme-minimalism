import { DefaultTheme } from 'vitepress/theme';

export interface IPost {
  title: string;
  datetime: string;
  permalink: string;
  order: number;
  pinned: boolean;
  display?: 'none';
  tags?: string[];
  category?: string;
  excerpt: string;
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

export interface IGroup {
  [key: string]: IPost[];
}

export interface ThemeConfig extends DefaultTheme.Config {
  posts?: IPost[];
  page?: IPage;
}
