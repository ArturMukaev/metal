import { MetadataRoute } from "next";
import { prisma } from "@/lib/utils/prisma";
import servicesData from "@/lib/data/services.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.perm-metalloobrabotka.ru";

  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/article`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakty`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
  ];

  // Страницы услуг
  const servicePages: MetadataRoute.Sitemap = [];

  servicesData.forEach(service => {
    if (service.isMainService) {
      servicePages.push({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    } else if (service.parentService) {
      const parentService = servicesData.find(
        s => s.id === service.parentService
      );
      if (parentService) {
        servicePages.push({
          url: `${baseUrl}/services/${parentService.slug}/${service.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
    }
  });

  // Статьи из БД
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    articlePages = articles.map(article => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  return [...staticPages, ...servicePages, ...articlePages];
}
