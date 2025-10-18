import { companyInfo } from '@/lib/data/company';
import {
  Settings,
  ShieldCheck,
  Award,
  DollarSign,
  Zap,
  Heart,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Settings,
  ShieldCheck,
  Award,
  DollarSign,
  Zap,
  Heart,
};

export function Advantages() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Нас выбирают за
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Профессиональный подход и современное оборудование для решения ваших задач
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyInfo.advantages.map((advantage, index) => {
            const Icon = iconMap[advantage.icon] || Settings;
            
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

