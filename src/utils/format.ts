/* eslint-disable max-len */
import { format } from 'date-fns';

import { getCurrentLanguage } from './languages';
import { COUNTRIES, FORMATS } from '@/constants';

export const dateRegex = /^(?:(?:31([/.])(?:0[13578]|1[02]))\1|(?:(?:29|30)([/.])(?:0[1,3-9]|1[0-2])\2))(?:(?:1[0-9]|[2-9]\d)\d{2})$|^(?:29([/.])02\3(?:(?:(?:1[0-9]|[2-9]\d)(?:0[48]|[02468][048]|[13579][26])|(?:(?:16|[02468][048]|[3579][26])00))))$|^(?:0[1-9]|1\d|2[0-8])([/.])(?:(?:0[1-9])|(?:1[0-2]))\4(?:(?:1[0-9]|[2-9]\d)\d{2})$/i;

export const countryToFlag = (isoCode: string): string => (
  typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
);

export const formatDate = (date: string): string => format(new Date(date.split(' ')[0]), getCurrentDateFormat());

export const formatDateWithoutYear = (date: string): string => format(new Date(date.split(' ')[0]), getCurrentDateWithoutYearFormat());

// eslint-disable-next-line max-len
export const getCurrentDateFormat = (): string => FORMATS.DATE[(getCurrentLanguage() as unknown as keyof typeof FORMATS.DATE)];
export const getCurrentDateWithoutYearFormat = (): string => FORMATS.DATE_WITHOUT_YEAR[(getCurrentLanguage() as unknown as keyof typeof FORMATS.DATE_WITHOUT_YEAR)];

export const getCountryIsoCode = (country: string): undefined | string => (
  COUNTRIES.find((countryIter) => countryIter.label === country)?.code
);
