import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'fr', 'hi'],
  defaultLocale: 'en'
});

export default function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Set hospital type based on subdomain
  const response = intlMiddleware(request);
  
  if (hostname.startsWith('hospital.localhost')) {
    response.headers.set('x-hospital-type', 'hospital');
    response.headers.set('x-hospital-org', 'hospital_org1');
  } else if (hostname.startsWith('clinic.localhost')) {
    response.headers.set('x-hospital-type', 'clinic');
    response.headers.set('x-hospital-org', 'hospital_org2');
  }
  
  return response;
}

export const config = {
  matcher: ['/', '/(en|es|fr|hi)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
};
