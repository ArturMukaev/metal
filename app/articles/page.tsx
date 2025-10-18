import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/utils/prisma";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Статьи о металлообработке",
  description:
    "Полезные статьи и материалы о металлообработке, технологиях производства и обработке металлических изделий.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function ArticlesPage() {
  let articles: any[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    // Продолжаем с пустым массивом если БД недоступна
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-dark-light text-white py-4">
        <div className="container-custom">
          <nav className="text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span>Статьи</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Статьи
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Познавательные материалы о металлообработке, технологиях
            производства и особенностях работы с различными материалами.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                Пока нет опубликованных статей. Скоро здесь появятся интересные
                материалы!
              </p>
              <Link
                href="/"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-6 py-3 rounded-lg transition-all"
              >
                На главную
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {articles.map(article => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {article.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={article.publishedAt?.toISOString()}>
                        {article.publishedAt?.toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
