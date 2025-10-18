'use client';

import { useState } from 'react';
import { companyInfo } from '@/lib/data/company';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Products() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 3; // Количество слайдов

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Текст */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Виды выпускаемой продукции
            </h2>
            <ul className="space-y-3">
              {companyInfo.products.map((product, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Карусель изображений */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/example.jpg.webp"
                alt="Продукция СТИЛКРАФТ"
                fill
                className="object-cover"
              />
            </div>

            {/* Навигация карусели */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="p-2 bg-dark hover:bg-dark-light rounded-full text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-2">
                {[...Array(slidesCount)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index ? 'bg-primary w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 bg-dark hover:bg-dark-light rounded-full text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

