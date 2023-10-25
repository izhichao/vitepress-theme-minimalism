import { DefaultTheme } from 'vitepress/theme';

export interface IPost {
  title: string;
  datetime: string;
  permalink: string;
  pinned: boolean;
  tags?: string[];
  excerpt: string;
  date: string;
  time: string;
  path: string;
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
}
