/* eslint-disable import/prefer-default-export */
import de from '@/data/countries/de.json';
import en from '@/data/countries/en.json';

export const mapGermanToEnglish = (name: string): string => {
  const element = de.find((country) => country.name === name);

  return (element && en.find((country) => country.id === element.id)?.name) || name;
};
