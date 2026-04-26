import { useData } from 'vitepress';
import { useOutDir } from './useOutDir';

export const useLink = () => {
  const { outDir } = useOutDir();
  const { theme } = useData();

  const isClassic: boolean = theme.value.classicCategory;

  const categoryLink = (category: string) => {
    if (!isClassic) return `${outDir}/category/${encodeURIComponent(category)}`;
    return `${outDir}/category?category=${category.replaceAll('&', '%26')}`;
  };

  const tagLink = (tag: string) => {
    if (!isClassic) return `${outDir}/tags/${encodeURIComponent(tag)}`;
    return `${outDir}/category?tag=${tag.replaceAll('&', '%26')}`;
  };

  return {
    categoryLink,
    tagLink
  };
};
