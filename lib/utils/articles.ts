import { prisma } from "./prisma";
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

/**
 * Fetch all articles from database and combine with prefilled articles
 * Articles from database are shown first (sorted by publishedAt desc)
 * Prefilled articles follow (sorted by publishedAt desc)
 */
export async function getAllArticles(): Promise<Article[]> {
  const dbArticles: Article[] = [];

  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });

    dbArticles.push(
      ...articles.map(article => ({
        ...article,
        excerpt: article.excerpt ?? undefined,
        coverImage: article.coverImage ?? undefined,
        metaTitle: article.metaTitle ?? undefined,
        metaDescription: article.metaDescription ?? undefined,
        publishedAt: article.publishedAt ?? undefined,
        authorUsername: article.authorUsername ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Error fetching articles from database:", error);
  }

  // Combine database articles with prefilled articles
  // Database articles come first, then prefilled articles
  const allArticles = [
    ...dbArticles,
    ...prefilledArticles.map(article => ({
      ...article,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt)
        : undefined,
    })),
  ];

  return allArticles;
}

/**
 * Get article by slug from either database or prefilled articles
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Try to find in database first
  try {
    const dbArticle = await prisma.article.findUnique({
      where: { slug, published: true },
    });

    if (dbArticle) {
      return {
        ...dbArticle,
        excerpt: dbArticle.excerpt ?? undefined,
        coverImage: dbArticle.coverImage ?? undefined,
        metaTitle: dbArticle.metaTitle ?? undefined,
        metaDescription: dbArticle.metaDescription ?? undefined,
        publishedAt: dbArticle.publishedAt ?? undefined,
        authorUsername: dbArticle.authorUsername ?? undefined,
      };
    }
  } catch (error) {
    console.error("Error fetching article from database:", error);
  }

  // If not found in database, check prefilled articles
  const prefilledArticle = prefilledArticles.find(
    article => article.slug === slug && article.published
  );

  if (prefilledArticle) {
    return {
      ...prefilledArticle,
      publishedAt: prefilledArticle.publishedAt
        ? new Date(prefilledArticle.publishedAt)
        : undefined,
    };
  }

  return null;
}
