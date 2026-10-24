import { DefaultTheme } from 'vitepress/theme';
import { HeadConfig } from 'vitepress';
import type { EncryptedContentPayload } from './utils/encryption.ts';

export interface IFolderConfig {
  /** 文章源文件夹路径，如 'posts' 或 'essays' */
  input: string;
  /** 生成的分页列表输出路径，第一项默认 ''（根目录），后续项默认 input */
  output?: string;
  /** 文章固定链接前缀，默认 input */
  permalink?: string;
  /** 是否生成 index.md 作为列表首页，第一项默认 true（或继承全局 index），后续项默认 true */
  index?: boolean;
  /** 该文件夹专属分页条数，未设置时继承全局 pageSize */
  pageSize?: number;
}

export type FolderOption = string | IFolderConfig;

export interface IPostsConfig {
  /** 文章文件夹配置，支持纯字符串简写如 ['posts', 'essays'] 或对象数组 */
  folder?: FolderOption[];
  /** 全局默认每页文章条数，默认 10 */
  pageSize?: number;
  /** 全局默认首项列表是否以 index.md 作为首页，默认 true */
  index?: boolean;
  /** 默认语言，默认 'zh' */
  lang?: string;
  /** 摘要截取长度，默认 0 */
  excerpt?: number;
  /** 全局默认固定链接前缀，默认 'posts' */
  permalink?: string;
  /** 页面插槽内容 */
  slot?: string;
  /** 页面自定义脚本内容 */
  custom?: string;
}

export interface IPost {
  id: string;
  title: string;
  datetime: string;
  permalink: string;
  folder?: string;
  order?: number;
  pinned?: string;
  password?: string;
  encryption?: EncryptedContentPayload;
  hidden?: boolean;
  draft?: boolean;
  deleted?: boolean;
  description?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  head?: HeadConfig[];
  prev?: { text?: string; link?: string };
  next?: { text?: string; link?: string };
}

export interface IPage {
  max?: number;
  pinned?: string;
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
