/* eslint-disable import/prefer-default-export */
import { getCurrentLanguage } from './languages';
import store from '@/store';

export const getName = (label: string): string | null => {
  const currentLanguage = getCurrentLanguage();
  const { qclasses } = store.getState().cashbuzz;

  const qclass = qclasses?.find((singleClass) => singleClass.label === label);

  if (!qclass) {
    return null;
  }

  switch (currentLanguage) {
    case 'en':
      return qclass.label_en;
    case 'de':
    default:
      return qclass.label_de;
  }
};
