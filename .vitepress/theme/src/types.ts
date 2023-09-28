import { DefaultTheme } from 'vitepress/theme';

export interface IPost {
  title: string;
  date: string;
  tags?: string[];
  permalink?: string;
  excerpt: string;
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
