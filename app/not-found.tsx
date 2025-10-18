import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          К сожалению, запрошенная страница не существует или была перемещена.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

