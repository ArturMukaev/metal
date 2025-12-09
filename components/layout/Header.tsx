"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, Clock, Home } from "lucide-react";
import { companyInfo } from "@/lib/data/company";
import { cn } from "@/lib/utils/cn";
import { CallbackButton } from "@/components/CallbackButton";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect navigation changes
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100); // Short delay to allow page to settle

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/services", label: "Услуги" },
    { href: "/gallery", label: "Наши работы" },
    { href: "/kontakty", label: "Контакты" },
    { href: "/article", label: "Статьи" },
  ];

  return (
    <>
      {/* Top Bar - закреплен на мобильных, скрывается при скролле на desktop */}
      <div
        className={cn(
          "bg-dark-light sticky top-0 z-40",
          isNavigating
            ? ""
            : "md:transition-all md:duration-300 md:ease-in-out",
          isScrolled ? "md:relative md:z-auto" : "md:sticky md:top-0 md:z-40"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between py-4 md:py-6">
            {/* Left side - Logo + Company info */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-20 h-16 md:w-28 md:h-20 -my-1 md:-my-2">
                  <Image
                    src="/logo.png"
                    alt={companyInfo.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-bold text-base md:text-lg group-hover:text-primary transition-colors">
                    {companyInfo.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {companyInfo.tagline}
                  </div>
                </div>
              </Link>
            </div>

            {/* Right side - Contact info + Mobile buttons */}
            <div className="flex items-center gap-2 md:gap-6">
              {/* Desktop: полная информация */}
              <div className="hidden lg:flex items-center gap-5 text-gray-300 text-base">
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {companyInfo.email}
                </a>
                <div className="flex flex-col text-base">
                  <span className="text-gray-400">График работы:</span>
                  <span>{companyInfo.schedule}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {companyInfo.phones.map(phone => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="text-primary hover:text-primary-light transition-colors font-semibold text-base whitespace-nowrap"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
                <div
                  className={cn(
                    isNavigating
                      ? ""
                      : "md:transition-opacity md:duration-300 md:ease-in-out",
                    isScrolled
                      ? "md:opacity-0 md:pointer-events-none"
                      : "md:opacity-100"
                  )}
                >
                  <CallbackButton>Обратный вызов</CallbackButton>
                </div>
              </div>

              {/* Tablet: компактная информация */}
              <div className="hidden md:flex lg:hidden items-center gap-3 text-gray-300 text-sm">
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {companyInfo.email}
                </a>
                <div className="flex flex-col gap-1">
                  {companyInfo.phones.map(phone => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="text-primary hover:text-primary-light transition-colors font-semibold text-sm whitespace-nowrap"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
                <div
                  className={cn(
                    isNavigating
                      ? ""
                      : "md:transition-opacity md:duration-300 md:ease-in-out",
                    isScrolled
                      ? "md:opacity-0 md:pointer-events-none"
                      : "md:opacity-100"
                  )}
                >
                  <CallbackButton>Обратный вызов</CallbackButton>
                </div>
              </div>

              {/* Mobile: кнопки с иконками + меню */}
              <div className="flex md:hidden items-center gap-3">
                <a
                  href={`tel:${companyInfo.phones[0].replace(/\D/g, "")}`}
                  className="p-3 bg-dark-light hover:bg-dark-lighter rounded-full transition-colors border border-primary/20 hover:border-primary/40"
                  title="Позвонить"
                >
                  <Phone className="w-5 h-5 text-primary" />
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="p-3 bg-dark-light hover:bg-dark-lighter rounded-full transition-colors border border-primary/20 hover:border-primary/40"
                  title="Написать на почту"
                >
                  <Mail className="w-5 h-5 text-primary" />
                </a>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-3 bg-dark-light hover:bg-dark-lighter rounded-full transition-colors border border-primary/20 hover:border-primary/40"
                  title="Открыть меню"
                >
                  <Menu className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar - закреплена при скролле */}
      <header
        className={cn(
          "sticky top-0 z-50 hidden md:block",
          isNavigating
            ? ""
            : "md:transition-all md:duration-500 md:ease-in-out",
          isScrolled ? "md:shadow-lg" : ""
        )}
        style={{ backgroundColor: "#565656" }}
      >
        <div className="container-custom">
          <div
            className={cn(
              "flex items-center justify-between",
              isNavigating ? "" : "md:transition-all md:duration-300",
              isScrolled ? "py-5" : "py-4"
            )}
          >
            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-white hover:text-primary transition-colors"
              >
                <Home className="w-5 h-5" />
              </Link>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-primary transition-colors font-medium uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Callback Button - появляется при скролле */}
            <div
              className={cn(
                isNavigating
                  ? ""
                  : "md:transition-opacity md:duration-300 md:ease-in-out",
                isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <CallbackButton>Обратный вызов</CallbackButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - выезжающее справа сверху */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[60] md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Full screen menu */}
        <div
          className="w-screen h-screen overflow-y-auto pb-32"
          style={{ backgroundColor: "#3A3A3A" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-lighter">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt={companyInfo.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-bold">{companyInfo.name}</div>
                <div className="text-gray-400 text-xs">
                  {companyInfo.tagline}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-dark-light rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6">
            <ul className="space-y-6">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-white hover:text-primary transition-colors text-lg"
                >
                  <Home className="w-6 h-6" />
                  Главная
                </Link>
              </li>
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-primary transition-colors block text-lg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="px-6 py-4 border-t border-dark-lighter">
            <h3 className="text-white font-bold text-lg mb-4">Контакты</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-3 text-white hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                {companyInfo.email}
              </a>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  {companyInfo.phones.map((phone, index) => (
                    <div key={phone} className="flex items-center gap-2">
                      <a
                        href={`tel:${phone.replace(/\D/g, "")}`}
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        {phone}
                      </a>
                      {index < companyInfo.phones.length - 1 && (
                        <span className="text-gray-400 hidden sm:inline">
                          |
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-white">{companyInfo.schedule}</span>
              </div>
              {/* <div className="text-gray-400 text-sm space-y-1">
                <div>{companyInfo.address}</div>
                <div>ИНН {companyInfo.inn}</div>
                <div>ОГРНИП {companyInfo.ogrn}</div>
                <div>р/с {companyInfo.bankAccount}</div>
              </div> */}
            </div>
          </div>

          {/* Callback Button */}
          <div className="p-6 border-t border-dark-lighter">
            <CallbackButton variant="full-width">Обратный вызов</CallbackButton>
          </div>
        </div>
      </div>
    </>
  );
}
