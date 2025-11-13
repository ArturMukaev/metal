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
    ];
  },
};

export default nextConfig;
