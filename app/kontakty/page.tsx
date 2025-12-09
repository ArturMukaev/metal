import { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { companyInfo } from "@/lib/data/company";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Контакты компании СТИЛКРАФТ. ${companyInfo.address}. Телефоны: ${companyInfo.phones.join(", ")}. Email: ${companyInfo.email}`,
  alternates: {
    canonical: "/kontakty",
  },
};

export default function ContactsPage() {
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
            <span>Контакты</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Контакты
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Наши контакты
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        График работы
                      </h3>
                      <p className="text-gray-600">{companyInfo.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        {companyInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Телефоны
                      </h3>
                      <div className="space-y-1">
                        {companyInfo.phones.map(phone => (
                          <div key={phone}>
                            <a
                              href={`tel:${phone.replace(/\D/g, "")}`}
                              className="text-primary hover:text-primary-dark transition-colors font-semibold"
                            >
                              {phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        WhatsApp
                      </h3>
                      <a
                        href={companyInfo.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark transition-colors font-semibold"
                      >
                        Связаться через WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Адрес
                      </h3>
                      <p className="text-gray-600">{companyInfo.address}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Реквизиты
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>ИНН:</strong> {companyInfo.inn}
                    </p>
                    <p>
                      <strong>ОГРНИП:</strong> {companyInfo.ogrn}
                    </p>
                    <p>
                      <strong>р/с:</strong> {companyInfo.bankAccount}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Напишите нам
                </h2>
                <p className="text-gray-600 mb-6">
                  Заполните форму, и мы свяжемся с вами в ближайшее время
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Как нас найти
          </h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Aeb58fe079098223d29348af18fe153613d9193357e59a02adfdf841fd5c4a48a&amp;source=constructor"
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
