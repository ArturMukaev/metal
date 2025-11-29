/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 960, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Для продакшена на VPS
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/services/metalloobrabotka-v-permi",
        destination: "/services/metalloobrabotka",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-nestandartnogo-oborudovaniya-v-permi",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-nestandartnogo-oborudovaniya-v-permi",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-valov",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-valov",
        permanent: true,
      },
      {
        source: "/service/frezernaya-obrabotka",
        destination: "/services/frezernaya-obrabotka",
        permanent: true,
      },
      {
        source: "/service/shlifovka-i-polirovka",
        destination: "/services/shlifovanie/shlifovka-i-polirovka",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-shesteren-v-permi",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-shesteren-v-permi",
        permanent: true,
      },
      {
        source: "/service/tokarnaya-obrabotka-metalla",
        destination: "/services/tokarnaya-obrabotka-metalla",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-zubchatykh-muft",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-zubchatykh-muft",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-vencov-s-naruzhnym-zubchatym-zacepleniem",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-vencov-s-naruzhnym-zubchatym-zacepleniem",
        permanent: true,
      },
      {
        source: "/service/termoobrabotka-metalla",
        destination: "/services/termoobrabotka-metalla",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-detaley-po-chertezham-v-permi",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-detaley-po-chertezham-v-permi",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-zubchatykh-peredach",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-zubchatykh-peredach",
        permanent: true,
      },
      {
        source: "/service/shlifovka-metalla-v-permi",
        destination: "/services/shlifovanie/shlifovka-i-polirovka",
        permanent: true,
      },
      {
        source: "/service/glubokoe-sverlenie",
        destination: "/services/metalloobrabotka/glubokoe-sverlenie",
        permanent: true,
      },
      {
        source: "/service/zuboreznye-raboty",
        destination: "/services/rezka-metalla/zuboreznye-raboty",
        permanent: true,
      },
      {
        source: "/service/rastochnye-raboty",
        destination: "/services/metalloobrabotka/rastochnye-raboty",
        permanent: true,
      },
      {
        source: "/service/polirovka-metalla-v-permi",
        destination: "/services/metalloobrabotka/polirovka-metalla",
        permanent: true,
      },
      {
        source: "/services/polirovka-metalla-v-permi",
        destination: "/services/metalloobrabotka/polirovka-metalla",
        permanent: true,
      },
      {
        source: "/service/metalloobrabotka-v-permi",
        destination: "/services/metalloobrabotka",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-vencov-s-vnutrennim-zubchatym-zacepleniem",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-vencov-s-vnutrennim-zubchatym-zacepleniem",
        permanent: true,
      },
      {
        source: "/service/izgotovlenie-shesteryon",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-shesteren-v-permi",
        permanent: true,
      },
      {
        source: "/services/izgotovlenie-shesteryon",
        destination: "/services/izgotovlenie-detaley/izgotovlenie-shesteren-v-permi",
        permanent: true,
      },
      {
        source: "/service/gibka-metalla",
        destination: "/services/gibka-metalla",
        permanent: true,
      },
      {
        source: "/service/galvanicheskoe-pokrytie-metalla",
        destination: "/services/metalloobrabotka/galvanicheskoe-pokrytie-metalla",
        permanent: true,
      },
      {
        source: "/service/termoobrabotka",
        destination: "/services/termoobrabotka-metalla",
        permanent: true,
      },
      {
        source: "/services/termoobrabotka",
        destination: "/services/termoobrabotka-metalla",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
