import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Наши работы - Галерея выполненных работ",
  description:
    "Примеры выполненных работ компании СТИЛКРАФТ. Фотографии готовых изделий и процессов металлообработки.",
};

// Временные статические данные для галереи
// В будущем будут загружаться из БД через Telegram бот
const galleryImages = [
  { id: 1, title: "Шестерни", image: "/example.jpg.webp" },
  { id: 2, title: "Валы", image: "/example.jpg.webp" },
  { id: 3, title: "Зубчатые колеса", image: "/example.jpg.webp" },
  { id: 4, title: "Фрезерные работы", image: "/example.jpg.webp" },
  { id: 5, title: "Токарные работы", image: "/example.jpg.webp" },
  { id: 6, title: "Готовые изделия", image: "/example.jpg.webp" },
  { id: 7, title: "Металлоконструкции", image: "/example.jpg.webp" },
  { id: 8, title: "Детали по чертежам", image: "/example.jpg.webp" },
  { id: 9, title: "Зуборезные работы", image: "/example.jpg.webp" },
  { id: 10, title: "Нестандартное оборудование", image: "/example.jpg.webp" },
  { id: 11, title: "Муфты", image: "/example.jpg.webp" },
  { id: 12, title: "Венцы", image: "/example.jpg.webp" },
];

export default function GalleryPage() {
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
            <span>Наши работы</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Изготовление металлоизделий: примеры выполненных работ
          </h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 mb-4">
              Компания «СТИЛ КРАФТ» изготовит на заказ по чертежам заказчика
              металлические конструкции и изделия, нестандартное оборудование
              для разных сфер промышленности. На официальном сайте можно
              ознакомиться с примерами выполненных работ. Предлагаем вниманию
              клиентов фотографии, отображающие технологические процессы на
              предприятии и демонстрирующие готовые изделия.
            </p>
            <p className="text-lg text-gray-700">
              За время работы ООО «СТИЛ КРАФТ» получило огромное количество
              заказов. Мы постоянно расширяем клиентскую базу, улучшая оснащение
              предприятия, расширяя перечень предоставляемых услуг и оптимизируя
              цены на механообработку металла. Работаем с конструкционными и
              нержавеющими сталями, цветным металлом. Нам доверяют, поскольку на
              каждое металлоизделие мастера дают гарантию.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map(item => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Фрезерная обработка и другие услуги металлообработки в Перми
          </h2>
          <p className="text-gray-700 mb-4">
            За время работы ООО «СТИЛ КРАФТ» получило огромное количество
            заказов. Мы постоянно расширяем клиентскую базу, улучшая оснащение
            предприятия, расширяя перечень предоставляемых услуг и оптимизируя
            цены на механообработку металла. Работаем с конструкционными и
            нержавеющими сталями, цветным металлом. Нам доверяют, поскольку на
            каждое металлоизделие мастера дают гарантию.
          </p>
          <p className="text-gray-700">
            Узнать больше об условиях сотрудничества можно по телефону{" "}
            <a
              href="tel:+79027981670"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              +7 (902) 798-16-70
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
