import fg from 'fast-glob';
import matter from 'gray-matter';

export default {
  async paths() {
    const paths = await fg('posts/**/*.md');
    const tags = new Set<string>();
    const isProd = process.env.NODE_ENV === 'production';

    for (const postPath of paths) {
      const { data } = matter.read(postPath);
      const skip = isProd && (data.draft || data.hidden);

      if (Array.isArray(data.tags) && !skip) {
        data.tags.forEach((tag: unknown) => {
          if (tag != null) tags.add(String(tag));
        });
      }
    }

    const routePaths = [...tags].map((tag) => ({
      params: { tag }
    }));

    routePaths.push({ params: { tag: 'index' } });

    return routePaths;
  }
};
