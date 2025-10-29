import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { Products } from "@/components/Products";
import { ServiceCard } from "@/components/ServiceCard";
import { ContactForm } from "@/components/ContactForm";
import servicesData from "@/lib/data/services.json";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function HomePage() {
  // Показываем 4 основные услуги на главной
  const featuredServices = servicesData.slice(0, 4);

  return (
    <>
      <Hero />
      <Head>
        <link rel="preload" href="/images/mainPage/carousel1.webp" as="image" />
        <link rel="preload" href="/images/mainPage/carousel2.webp" as="image" />
        <link rel="preload" href="/images/mainPage/carousel3.webp" as="image" />
        <link rel="preload" href="/images/mainPage/carousel4.webp" as="image" />
      </Head>

      {/* Основное описание */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              <strong>
                Наше предприятие осуществляет полный комплекс мероприятий по
                разработке и изготовлению нестандартного оборудования для
                различных отраслей промышленности: металлургии, нефтяной,
                химической, газовой, строительства и др. Мы изготовим
                металлические конструкции машиностроительного, строительного,
                технологического, промышленного назначения. Также изготовим
                детали, узлы и агрегаты к машинам и механизмам таким, как
                транспортные средства, промышленное оборудование, прессформы и
                иные технические изделия.
              </strong>
            </p>
            <p className="text-lg text-gray-700 mt-4">
              Изготовление деталей и сборку производим по чертежам или образцам,
              предоставленным заказчиком из собственного материала или
              давальческого сырья.
            </p>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <Advantages />

      {/* Виды продукции */}
      <Products />

      {/* Услуги */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Услуги
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Все услуги
            </Link>
          </div>
        </div>
      </section>

      {/* Форма обратной связи */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Изображение */}
            <div className="order-2 lg:order-1 hidden lg:block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/services/tokarnaya-obrabotka-metalla.webp"
                  alt="Свяжитесь с нами"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Форма */}
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
    </>
  );
}
