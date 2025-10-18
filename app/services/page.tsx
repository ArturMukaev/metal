import { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import servicesData from "@/lib/data/services.json";

export const metadata: Metadata = {
  title: "Услуги металлообработки в Перми",
  description:
    "Полный перечень услуг по металлообработке: токарные, фрезерные, зуборезные работы, изготовление деталей по чертежам.",
  openGraph: {
    title: "Услуги металлообработки в Перми | СТИЛКРАФТ",
    description:
      "Полный перечень услуг по металлообработке: токарные, фрезерные, зуборезные работы.",
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
          <p className="text-lg text-gray-600 max-w-3xl">
            Изготовление металлопроката придает значение техническим процессам
            обработки металла. Компания «СТИЛКРАФТ» предоставляет услуги
            производства металлоизделий методом фрезерной, токарной обработки и
            последующей шлифовки, полировки. Готовая продукция соответствует
            высоким стандартам, характеризуется надежностью, точностью размеров,
            долгим сроком службы.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {servicesData.map(service => (
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
          <p className="text-gray-700 mb-6">
            Изготовление металлопроката придает значение техническим процессам
            обработки металла. Компания «СТИЛКРАФТ» предоставляет услуги
            производства металлоизделий методом фрезерной, токарной обработки и
            последующей шлифовки, полировки. Готовая продукция соответствует
            высоким стандартам, характеризуется надежностью, точностью размеров,
            долгим сроком службы.
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

          <p className="text-gray-700">
            Заказчикам предоставляются услуги резки и гибки металла.
            Изготовление нестандартных деталей по чертежам – одно из основных
            направлений деятельности компании.
          </p>
        </div>
      </section>
    </div>
  );
}
