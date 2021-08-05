
import { browserName, browserVersion, mobileModel, osName, osVersion } from 'react-device-detect';
import { Action } from 'redux';

import { AuthAction } from '@/actions';
import { ICONS } from '@/assets';
import ROUTES from '@/constants/routes';
import i18n from '@/i18n';
import store from '@/store';
import { MenuLabelsType } from '@/types';

export type Item = {
  action?: () => void;
  icon: string;
  isSeparator?: boolean;
  path?: string;
  title: string;
}

export const menuMap: { [key in MenuLabelsType]: Item } = {
  'general-accounts': {
    icon: ICONS.BANK,
    path: ROUTES.AUTHORIZED.BANK_ACCOUNTS,
    title: 'general-accounts'
  },
  'general-affinities': {
    icon: ICONS.IMAGE_FILTER,
    path: ROUTES.AUTHORIZED.AFFINITIES,
    title: 'general-affinities'
  },
  'general-attributes': {
    icon: ICONS.SUNGLASSES,
    path: ROUTES.AUTHORIZED.ATTRIBUTES,
    title: 'general-attributes'
  },
  'general-category-tree': {
    icon: ICONS.CHAT_TREE,
    path: ROUTES.AUTHORIZED.CATEGORY_TREE,
    title: 'general-category-tree'
  },
  'general-connection': {
    icon: ICONS.PLUS_CIRCLE_OUTLINE,
    path: ROUTES.AUTHORIZED.ADD_BANK_CONNECTION,
    title: 'general-connection'
  },
  'general-contact': {
    action: (): void => {
      let contactHref = store.getState().cashbuzz.data?.contact;

      if (!contactHref) {
        return;
      }


      contactHref = contactHref.replace(encodeURI('{osv}'), `${osName} ${osVersion}`);
      contactHref = contactHref.replace(encodeURI('{device}'), `${mobileModel !== 'none' ? `${mobileModel} ` : ''}${browserName} ${browserVersion}`);
      contactHref = contactHref.replace(encodeURI('{appv}'), 'WebApp');

      const element = document.createElement('a');
      element.href = contactHref;

      document.body.append(element);
      element.click();
      document.body.removeChild(element);
    },
    icon: ICONS.EMAIL,
    title: 'general-contact'
  },
  'general-contracts': {
    icon: ICONS.FILE_DOCUMENT_OUTLINE,
    path: ROUTES.AUTHORIZED.CONTRACTS,
    title: 'general-contracts'
  },
  'general-expenses': {
    icon: ICONS.CHEVRON_DOWN_BOX_OUTLINE,
    path: ROUTES.AUTHORIZED.EXPENSES,
    title: 'general-expenses'
  },
  'general-income': {
    icon: ICONS.CHEVRON_UP_BOX_OUTLINE,
    path: ROUTES.AUTHORIZED.INCOME,
    title: 'general-income'
  },

  'general-logout': {
    action: (): void => {
      store.dispatch((AuthAction.logout() as unknown as Action));
    },
    icon: ICONS.LOGOUT,
    title: 'general-logout'
  },
  'general-overview': {
    icon: ICONS.LAYERS_TRIPLE_OUTLINE,
    path: ROUTES.AUTHORIZED.DASHBOARD,
    title: 'general-overview'
  },
  'regios-overview': {
    icon: ICONS.LAYERS_TRIPLE_OUTLINE,
    path: `${ROUTES.AUTHORIZED.REGIOS}`,
    title: 'regios-overview'
  },
  'general-profile': {
    icon: ICONS.COG,
    path: ROUTES.AUTHORIZED.SETTINGS,
    title: 'general-profile'
  },
  'general-profitloss': {
    icon: ICONS.CHART_BAR,
    path: ROUTES.AUTHORIZED.PROFIT_AND_LOSS,
    title: 'general-profitloss'
  },
  'general-transactions': {
    icon: ICONS.SWAP_HORIZONTAL,
    path: ROUTES.AUTHORIZED.TRANSACTIONS,
    title: 'general-transactions'
  },
  'general-vouchers': {
    icon: ICONS.TICKET,
    path: ROUTES.AUTHORIZED.VOUCHERS,
    title: 'general-vouchers'
  },
  'trader-cashback': {
    icon: ICONS.CURRENCY_EUR,
    path: ROUTES.AUTHORIZED.CASH_BACKS,
    title: 'trader-cashback'
  },
  'trader-connection': {
    icon: ICONS.PLUS_CIRCLE_OUTLINE,
    path: ROUTES.AUTHORIZED.ADD_BANK_CONNECTION,
    title: 'trader-connection'
  },
  'trader-documents': {
    icon: ICONS.STICKER_PLUS_OUTLINE,
    path: ROUTES.AUTHORIZED.DOCUMENTS,
    title: 'trader-documents'
  },
  'trader-faq': {
    action: (): void => {
      if (i18n.language === 'de') {
        window.open('https://cashbuzz.io/de/faq/');
      } else {
        window.open('https://cashbuzz.io/faq/');
      }
    },
    icon: ICONS.HELP_CIRCLE_OUTLINE,
    path: ROUTES.AUTHORIZED.FAQ,
    title: 'trader-faq'
  },
  'trader-mgm': {
    icon: ICONS.CROWN_OUTLINED,
    path: ROUTES.AUTHORIZED.CODE,
    title: 'trader-mgm'
  },
  'trader-overview': {
    icon: ICONS.HOME,
    path: ROUTES.AUTHORIZED.DASHBOARD,
    title: 'trader-overview'
  },
  'trader-profile': {
    icon: ICONS.COG,
    path: ROUTES.AUTHORIZED.SETTINGS,
    title: 'trader-profile'
  },
  'trader-reports': {
    icon: ICONS.PRINT,
    path: ROUTES.AUTHORIZED.REPORTS,
    title: 'trader-reports'
  },
  'trader-securities': {
    icon: ICONS.SAFE_SQUARE_OUTLINE,
    path: ROUTES.AUTHORIZED.SECURITIES,
    title: 'trader-securities'
  },
  'trader-trades': {
    icon: ICONS.CHART_TIMELINE_VARIANT,
    path: ROUTES.AUTHORIZED.TRADES,
    title: 'trader-trades'
  },
  'trader-transactions': {
    icon: ICONS.SWAP_HORIZONTAL,
    path: ROUTES.AUTHORIZED.TRANSACTIONS,
    title: 'trader-transactions'
  },
  'sme-connection': {
    icon: ICONS.PLUS_CIRCLE_OUTLINE,
    path: ROUTES.AUTHORIZED.ADD_BANK_CONNECTION,
    title: 'sme-connection'
  },
  'sme-contracts': {
    icon: ICONS.FILE_DOCUMENT_OUTLINE,
    path: ROUTES.AUTHORIZED.CONTRACTS,
    title: 'sme-contracts'
  },
  'sme-expenses': {
    icon: ICONS.CHEVRON_DOWN_BOX_OUTLINE,
    path: ROUTES.AUTHORIZED.EXPENSES,
    title: 'sme-expenses'
  },
  'sme-faq': {
    action: (): void => {
      if (i18n.language === 'de') {
        window.open('https://cashbuzz.io/de/faq-sme/');
      } else {
        window.open('https://cashbuzz.io/faq-sme/');
      }
    },
    icon: ICONS.HELP_CIRCLE_OUTLINE,
    path: ROUTES.AUTHORIZED.FAQ,
    title: 'sme-faq'
  },
  'sme-income': {
    icon: ICONS.CHEVRON_UP_BOX_OUTLINE,
    path: ROUTES.AUTHORIZED.INCOME,
    title: 'sme-income'
  },
  'sme-invoices': {
    icon: ICONS.PEN,
    path: ROUTES.AUTHORIZED.INVOICES,
    title: 'sme-invoices'
  },
  'sme-overview': {
    icon: ICONS.LAYERS_TRIPLE_OUTLINE,
    path: ROUTES.AUTHORIZED.DASHBOARD,
    title: 'sme-overview'
  },
  'sme-profile': {
    icon: ICONS.COG,
    path: ROUTES.AUTHORIZED.SETTINGS,
    title: 'sme-profile'
  },
  'sme-profitloss': {
    icon: ICONS.CHART_BAR,
    path: ROUTES.AUTHORIZED.PROFIT_AND_LOSS,
    title: 'sme-profitloss'
  },
  'sme-transactions': {
    icon: ICONS.SWAP_HORIZONTAL,
    path: ROUTES.AUTHORIZED.TRANSACTIONS,
    title: 'sme-transactions'
  },
  // pocket-flowerchart-test
  'pocket-flowerchart-test': {
    icon: ICONS.SWAP_HORIZONTAL,
    path: '/flower-chart-test',
    title: 'pocket-flowerchart-test'
  },
  'pocket-transactions': {
    icon: ICONS.SWAP_HORIZONTAL,
    path: `${ROUTES.AUTHORIZED.TRANSACTIONS}`,
    title: 'pocket-transactions'
  },
  separator: {
    icon: '',
    isSeparator: true,
    title: ''
  }
};
