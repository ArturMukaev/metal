import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import servicesData from "./lib/data/services.json";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle old service URLs that need to be redirected to nested structure
  if (pathname.startsWith("/services/")) {
    const pathSegments = pathname.split("/").filter(Boolean);

    // If it's a direct service URL (not already nested)
    if (pathSegments.length === 2) {
      const serviceSlug = pathSegments[1];
      const service = servicesData.find(s => s.slug === serviceSlug);

      if (service && !service.isMainService && service.parentService) {
        // It's a sub-service, redirect to nested URL
        const parentService = servicesData.find(
          s => s.id === service.parentService
        );
        if (parentService) {
          const newUrl = `/services/${parentService.slug}/${service.slug}`;
          return NextResponse.redirect(new URL(newUrl, request.url), 301);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
