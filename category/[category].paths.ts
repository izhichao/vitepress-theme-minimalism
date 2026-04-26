import fg from 'fast-glob';
import matter from 'gray-matter';

export default {
  async paths() {
    const paths = await fg('posts/**/*.md');
    const categories = new Set<string>();
    const isProd = process.env.NODE_ENV === 'production';

    for (const postPath of paths) {
      const { data } = matter.read(postPath);
      const skip = isProd && (data.draft || data.hidden);

      if (data.category && !skip) {
        categories.add(String(data.category));
      }
    }

    const routePaths = [...categories].map((category) => ({
      params: { category }
    }));

    routePaths.push({ params: { category: 'index' } });

    return routePaths;
  }
};
