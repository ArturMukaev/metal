import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ServiceCard } from "@/components/ServiceCard";
import servicesData from "@/lib/data/services.json";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return servicesData.map(service => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = servicesData.find(s => s.slug === params.slug);

  if (!service) {
    return {
      title: "Услуга не найдена",
    };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: `/services/${params.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      images: [{ url: service.image }],
    },
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = servicesData.find(s => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  // If this is a sub-service, redirect to the nested route
  if (!service.isMainService && service.parentService) {
    const parentService = servicesData.find(
      s => s.id === service.parentService
    );
    if (parentService) {
      redirect(`/services/${parentService.slug}/${service.slug}`);
    }
  }

  // Получаем подуслуги для главной услуги
  const subServices =
    service.isMainService && service.subServices
      ? servicesData.filter(s => service.subServices?.includes(s.id))
      : [];

  // Другие услуги для рекомендаций (только главные услуги)
  const otherServices = servicesData
    .filter(s => s.id !== service.id && s.isMainService)
    .slice(0, 4);

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
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Услуги
            </Link>
            <span>/</span>
            <span className="line-clamp-1">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/50" />
        </div>
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
            {service.shortDescription}
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Оставить заявку
          </a>
        </div>
      </section>

      {/* Sub-services Section */}
      {subServices.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Виды работ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subServices.map(subService => (
                <ServiceCard key={subService.id} service={subService} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {service.content ? (
                <div
                  className="custom-content"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              ) : (
                <>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {service.description}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                    О услуге {service.title}
                  </h2>
                  <p className="text-gray-700">
                    Компания СТИЛКРАФТ предлагает профессиональные услуги по{" "}
                    {service.title.toLowerCase()}. Мы используем современное
                    оборудование и технологии, что позволяет нам гарантировать
                    высокое качество выполнения работ и точное соблюдение всех
                    технических требований.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                    Преимущества работы с нами
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Высокая точность изготовления деталей</li>
                    <li>Современное оборудование с ЧПУ</li>
                    <li>Опытные специалисты</li>
                    <li>Строгий контроль качества</li>
                    <li>Конкурентные цены</li>
                    <li>Соблюдение сроков</li>
                  </ul>

                  <p className="text-gray-700 mt-6">
                    Стоимость работ определяется индивидуально под каждый заказ.
                    Для получения подробной информации и расчета стоимости
                    свяжитесь с нашими специалистами.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Другие услуги
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherServices.map(s => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/services"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-8 py-3 rounded-lg transition-all"
              >
                Все услуги
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 hidden lg:block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/example.webp"
                  alt="Свяжитесь с нами"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Напишите нам, мы ответим на все ваши вопросы
              </h2>
              <p className="text-gray-600 mb-6">
                Заполните форму, и менеджер свяжется с вами для обсуждения
                деталей
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
