import Image from "next/image";
import { companyInfo } from "@/lib/data/company";
import { CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-[600px] lg:h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/examples/example27.jpg" //"/images/mainPage/bg.webp"
          alt="Металлообработка"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/70" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in">
            Комплексная металлообработка, изготовление нестандартного
            оборудования и деталей машин, узлов, агрегатов
          </h1>

          <div className="space-y-3 mb-8 animate-slide-up">
            {companyInfo.heroFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-white text-lg">{feature}</p>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-block bg-primary hover:bg-primary-dark text-dark font-bold text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg animate-scale-in"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </section>
  );
}
