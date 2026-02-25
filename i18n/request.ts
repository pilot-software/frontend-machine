import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'es', 'fr', 'hi', 'gu', 'mr', 'bn', 'ta', 'te', 'kn'];

export default getRequestConfig(async ({locale}) => {
  const finalLocale = locales.includes(locale) ? locale : 'en';
  
  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});
