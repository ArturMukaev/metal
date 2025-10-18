import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/utils/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, User } from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!article) {
    return { title: 'Статья не найдена' };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export const revalidate = 3600;

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-dark-light text-white py-4">
        <div className="container-custom">
          <nav className="text-sm flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-primary transition-colors">
              Статьи
            </Link>
            <span>/</span>
            <span className="line-clamp-1">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                {article.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.publishedAt.toISOString()}>
                      {article.publishedAt.toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                )}
                {article.authorUsername && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.authorUsername}</span>
                  </div>
                )}
              </div>

              {article.coverImage && (
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-xl mb-8">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>

            {/* Content */}
            <div className="markdown-content prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
            </div>

            {/* Back to Articles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
              >
                ← Вернуться к статьям
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

