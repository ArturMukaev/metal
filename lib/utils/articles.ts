import prefilledArticles from "@/lib/data/articles.json";

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  authorUsername?: string;
  containImage?: boolean;
}

export async function getAllArticles(): Promise<Article[]> {
  return prefilledArticles
    .filter(article => article.published)
    .map(article => ({
      ...article,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt)
        : undefined,
    }))
    .sort((a, b) => {
      if (!a.publishedAt || !b.publishedAt) return 0;
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = prefilledArticles.find(
    article => article.slug === slug && article.published
  );

  if (article) {
    return {
      ...article,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt)
        : undefined,
    };
  }

  return null;
}
