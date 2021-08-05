/* eslint-disable import/prefer-default-export */
import langs from 'langs';

import i18nInstance from '@/i18n';

export interface Language {
  '1': string;
  '2': string;
  '2B': string;
  '3': string;
  'local': string;
  'name': string;
}

export const getName = (language: string): string | undefined => {
  const selectedLanguage = getSelectedLanguage(language);

  return selectedLanguage && selectedLanguage.name;
};

export const to6391Format = (language: string): string | undefined => {
  const selectedLanguage = getSelectedLanguage(language);

  return selectedLanguage && selectedLanguage[1];
};

export const to6393Format = (language: string): string | undefined => {
  const selectedLanguage = getSelectedLanguage(language);

  return selectedLanguage && selectedLanguage[3];
};

export const getCurrentLanguage = (): string => i18nInstance.languages[0].split('-')[0];

export const getSelectedLanguage = (language: string): Language | undefined => {
  const parsedLanguage = language.toLowerCase().split('-')[0];

  return langs.where('1', parsedLanguage) || langs.where('3', parsedLanguage);
};
