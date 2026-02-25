import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es', 'fr', 'hi', 'gu', 'mr', 'bn', 'ta', 'te', 'kn'];

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/((?!_next|api|.*\\..*).*)']
};
