import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translationDE from './locales/de.json';
import translationEN from './locales/en.json';

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    whitelist: ['de', 'en'],
    nonExplicitWhitelist: true,
    detection: {
      order: ['navigator', 'querystring']
    },
    resources: {
      en: {
        translations: translationEN
      },
      de: {
        translations: translationDE
      }
    },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  });

export default i18n;
