import React from "react";
import { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import servicesData from "@/lib/data/services.json";
import { companyInfo } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Услуги металлообработки в Перми",
  description:
    "Широкий спектр услуг обработки металла в Перми: изготовление изделий из металла, проектирование и изготовление оборудования. Высокое качество и гибкий подход от компании СТИЛКРАФТ.",
  openGraph: {
    title: "Услуги металлообработки в Перми | СТИЛКРАФТ",
    description:
      "Широкий спектр услуг обработки металла в Перми: изготовление изделий из металла, проектирование и изготовление оборудования. Высокое качество и гибкий подход.",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-dark-light text-white py-4">
        <div className="container-custom">
          <nav className="text-sm">
            <a href="/" className="hover:text-primary transition-colors">
              Главная
            </a>
            <span className="mx-2">/</span>
            <span>Услуги</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Услуги
          </h1>
          <p className="text-lg text-gray-600">
            Компания «СТИЛКРАФТ» является ведущим поставщиком услуг
            металлообработки в Перми с более чем 10-летним опытом работы на
            рынке. Мы специализируемся на изготовлении металлических деталей и
            конструкций любой сложности по чертежам или образцам заказчика. В
            своей работы мы используем современное оборудование и проверенные
            технологии.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {servicesData
              .filter(service => service.isMainService)
              .map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Услуги качественной металлообработки в Перми
          </h2>
          <p className="text-gray-700 mb-8">
            Наше производство охватывает полный цикл металлообработки: от
            токарных и фрезерных работ до термической обработки и нанесения
            защитных покрытий. Каждое изделие проходит строгий контроль
            качества, что гарантирует соответствие высоким стандартам точности и
            надежности для клиентов из различных отраслей промышленности.
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            В перечень услуг по металлообработке входят самые востребованные
            виды работ:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>фрезерные;</li>
            <li>токарные;</li>
            <li>шлифовальные;</li>
            <li>гальванические;</li>
            <li>зуборезные.</li>
          </ul>

          <p className="text-gray-700 mb-8">
            Заказчикам предоставляются услуги резки и гибки металла.
            Изготовление нестандартных деталей по чертежам – одно из основных
            направлений деятельности компании.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Услуги по металлу и его обработке от компании СТИЛКРАФТ
          </h2>
          <p className="text-gray-700 mb-6">
            Компания &quot;СТИЛКРАФТ&quot; предлагает профессиональные услуги по
            обработке металла в Перми для клиентов из различных отраслей
            промышленности. Мы специализируемся на изготовлении металлических
            конструкций и оборудования промышленного назначения.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Изготовление изделий из металла для вашего бизнеса
          </h3>
          <p className="text-gray-700 mb-6">
            Мы выполняем изготовление изделий из металла, деталей и узлов по
            чертежам заказчика или образцам. Наша команда профессионалов
            работает с различными видами материалов, включая давальческое сырье.
            Вы можете заказать как единичные, так и серийные изделия.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Проектирование и изготовление оборудования
          </h3>
          <p className="text-gray-700 mb-6">
            В &quot;СТИЛКРАФТ&quot; вы получите не только производство, но и
            проектирование и изготовление оборудования для нужд вашего бизнеса.
            Мы разрабатываем и производим нестандартные конструкции для
            металлургии, нефтяной и химической отраслей, строительства и
            машиностроения.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Почему выбирают СТИЛКРАФТ?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>
              <strong>Гарантия качества:</strong> каждый этап производства
              строго контролируется.
            </li>
            <li>
              <strong>Гибкость:</strong> принимаем заказы любого объёма.
            </li>
            <li>
              <strong>Разумные цены:</strong> прямое сотрудничество без
              посредников.
            </li>
            <li>
              <strong>Комплексный подход:</strong> выполняем работы от резки
              металла до нанесения покрытий.
            </li>
          </ul>

          <p className="text-gray-700">
            Сотрудничество с надежным подрядчиком ООО «СТИЛКРАФТ» дает
            возможность быстро получить металлическую продукцию для дальнейшего
            использования в сфере строительства, машиностроения, нефтегазовой
            промышленности, металлургии. Каждому заказчику предложены лояльные
            условия сотрудничества. Узнайте больше о предложениях по телефону{" "}
            <a
              href={`tel:${companyInfo.phones[0].replace(/\D/g, "")}`}
              className="text-primary hover:text-primary-dark transition-colors font-semibold"
            >
              {companyInfo.phones[0]}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
