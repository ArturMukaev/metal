import Link from "next/link";
import { companyInfo } from "@/lib/data/company";
import { Mail, Phone, MapPin } from "lucide-react";
import servicesData from "@/lib/data/services.json";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const featuredServices = servicesData.slice(0, 10);

  return (
    <footer className="bg-dark text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Контакты */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p>{companyInfo.address}</p>
                  <p className="text-sm mt-1">
                    ИНН {companyInfo.inn}
                    <br />
                    ОГРНИП {companyInfo.ogrn}
                    <br />
                    р/с {companyInfo.bankAccount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  {companyInfo.phones.map(phone => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {companyInfo.email}
                </a>
              </div>
              <p className="text-sm">{companyInfo.schedule}</p>
            </div>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Услуги</h3>
            <ul className="space-y-2">
              {featuredServices.map(service => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-primary transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Меню */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Меню</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-primary transition-colors"
                >
                  Наши работы
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-primary transition-colors"
                >
                  Статьи
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Услуги
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakty"
                  className="hover:text-primary transition-colors"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-dark-lighter">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>
              © {currentYear} {companyInfo.name}. Все права защищены.
            </p>
            <p className="text-gray-400">
              Создано с использованием современных технологий Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
