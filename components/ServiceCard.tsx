import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";
import servicesData from "@/lib/data/services.json";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  // Generate the correct path based on service type
  const getServicePath = (service: Service): string => {
    if (service.isMainService) {
      return `/services/${service.slug}`;
    }

    if (service.parentService) {
      const parentService = servicesData.find(
        s => s.id === service.parentService
      );
      if (parentService) {
        return `/services/${parentService.slug}/${service.slug}`;
      }
    }

    return `/services/${service.slug}`;
  };

  return (
    <Link
      href={getServicePath(service)}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {service.shortDescription}
        </p>
      </div>
    </Link>
  );
}
