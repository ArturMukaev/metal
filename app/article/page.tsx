import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/utils/articles";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Статьи о металлообработке",
  description:
    "Полезные статьи и материалы о металлообработке, технологиях производства и обработке металлических изделий.",
  alternates: {
    canonical: "/article",
  },
};

export const revalidate = 36000;

const ARTICLES_PER_PAGE = 12;

interface ArticlesPageProps {
  searchParams: { page?: string };
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  // Get articles from prefilled JSON
  const allArticles = await getAllArticles();

  // Parse page number from URL
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));

  // Calculate pagination
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const articles = allArticles.slice(startIndex, endIndex);

  return (
    <div className="bg-gray-50">
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
          {allArticles.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {articles.map(article => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {article.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          quality={90}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      {article.publishedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <time
                            dateTime={
                              article.publishedAt instanceof Date
                                ? article.publishedAt.toISOString()
                                : new Date(article.publishedAt).toISOString()
                            }
                          >
                            {(article.publishedAt instanceof Date
                              ? article.publishedAt
                              : new Date(article.publishedAt)
                            ).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-2">
                    {/* Previous Button */}
                    {currentPage > 1 ? (
                      <Link
                        href={`/article${currentPage - 1 === 1 ? "" : `?page=${currentPage - 1}`}`}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Назад
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                        Назад
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        page => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Link
                                key={page}
                                href={`/article${page === 1 ? "" : `?page=${page}`}`}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-dark"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </Link>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>

                    {/* Next Button */}
                    {currentPage < totalPages ? (
                      <Link
                        href={`/article?page=${currentPage + 1}`}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Вперед
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                        Вперед
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
