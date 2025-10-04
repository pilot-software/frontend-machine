import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'hi'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(en|es|fr|hi)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
};
