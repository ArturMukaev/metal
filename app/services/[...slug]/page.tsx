import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ServiceCard } from "@/components/ServiceCard";
import servicesData from "@/lib/data/services.json";

interface CatchAllServicePageProps {
  params: {
    slug: string[];
  };
}

export async function generateStaticParams() {
  const params: Array<{ slug: string[] }> = [];

  servicesData.forEach(service => {
    if (service.isMainService) {
      // Add main service
      params.push({ slug: [service.slug] });

      // Add sub-services
      if (service.subServices) {
        service.subServices.forEach(subServiceId => {
          const subService = servicesData.find(s => s.id === subServiceId);
          if (subService) {
            params.push({
              slug: [service.slug, subService.slug],
            });
          }
        });
      }
    }
  });

  return params;
}

export async function generateMetadata({
  params,
}: CatchAllServicePageProps): Promise<Metadata> {
  const { slug } = params;

  if (slug.length === 1) {
    // Main service
    const service = servicesData.find(s => s.slug === slug[0]);
    if (!service || !service.isMainService) {
      return {
        title: "Услуга не найдена",
      };
    }

    return {
      title: service.metaTitle,
      description: service.metaDescription,
      alternates: {
        canonical: `/services/${slug[0]}`,
      },
      openGraph: {
        title: service.metaTitle,
        description: service.metaDescription,
        images: [{ url: service.image }],
      },
    };
  } else if (slug.length === 2) {
    // Sub-service
    const parentService = servicesData.find(s => s.slug === slug[0]);
    const childService = servicesData.find(s => s.slug === slug[1]);

    if (
      !childService ||
      !parentService ||
      !childService.parentService ||
      childService.parentService !== parentService.id
    ) {
      return {
        title: "Услуга не найдена",
      };
    }

    return {
      title: childService.metaTitle,
      description: childService.metaDescription,
      alternates: {
        canonical: `/services/${slug[0]}/${slug[1]}`,
      },
      openGraph: {
        title: childService.metaTitle,
        description: childService.metaDescription,
        images: [{ url: childService.image }],
      },
    };
  }

  return {
    title: "Услуга не найдена",
  };
}

export default function CatchAllServicePage({
  params,
}: CatchAllServicePageProps) {
  const { slug } = params;

  if (slug.length === 1) {
    // Handle main service
    const service = servicesData.find(s => s.slug === slug[0]);

    if (!service || !service.isMainService) {
      notFound();
    }

    // Получаем подуслуги для главной услуги
    const subServices = service.subServices
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
                      Стоимость работ определяется индивидуально под каждый
                      заказ. Для получения подробной информации и расчета
                      стоимости свяжитесь с нашими специалистами.
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
                    src="/images/examples/example25.jpg" //"/images/example2.jpg"
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
  } else if (slug.length === 2) {
    // Handle sub-service
    const parentService = servicesData.find(s => s.slug === slug[0]);
    const childService = servicesData.find(s => s.slug === slug[1]);

    if (!childService || !parentService) {
      notFound();
    }

    // Verify the relationship
    if (
      !childService.parentService ||
      childService.parentService !== parentService.id
    ) {
      notFound();
    }

    // Get sibling sub-services
    const siblingServices = parentService.subServices
      ? servicesData.filter(
          s =>
            parentService.subServices?.includes(s.id) &&
            s.id !== childService.id
        )
      : [];

    // Other main services for recommendations
    const otherServices = servicesData
      .filter(s => s.id !== parentService.id && s.isMainService)
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
              <Link
                href={`/services/${parentService.slug}`}
                className="hover:text-primary transition-colors"
              >
                {parentService.title}
              </Link>
              <span>/</span>
              <span className="line-clamp-1">{childService.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src={childService.image}
              alt={childService.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/50" />
          </div>
          <div className="container-custom relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {childService.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {childService.shortDescription}
            </p>
            <a
              href="#contact"
              className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Оставить заявку
            </a>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {childService.content ? (
                  <div
                    className="custom-content"
                    dangerouslySetInnerHTML={{ __html: childService.content }}
                  />
                ) : (
                  <>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {childService.description}
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                      О услуге {childService.title}
                    </h2>
                    <p className="text-gray-700">
                      Компания СТИЛКРАФТ предлагает профессиональные услуги по{" "}
                      {childService.title.toLowerCase()}. Мы используем
                      современное оборудование и технологии, что позволяет нам
                      гарантировать высокое качество выполнения работ и точное
                      соблюдение всех технических требований.
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
                      Стоимость работ определяется индивидуально под каждый
                      заказ. Для получения подробной информации и расчета
                      стоимости свяжитесь с нашими специалистами.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Other Sub-services */}
        {siblingServices.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-custom">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Другие виды работ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {siblingServices.map(s => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/services/${parentService.slug}`}
                  className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-8 py-3 rounded-lg transition-all"
                >
                  Все виды работ
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Other Services */}
        {otherServices.length > 0 && (
          <section className="section-padding bg-white">
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
        <section id="contact" className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 hidden lg:block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/images/examples/example25.jpg" //"/images/example.webp"
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

  // Invalid URL structure
  notFound();
}
