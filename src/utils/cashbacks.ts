import i18nInstance from '@/i18n';

export const CASHBACK_CODES = {
  0: 'new',
  100: 'claimed',
  102: 'approved',
  104: 'paymentScheduled',
  106: 'inPayout',
  200: 'redeemed',
  400: 'rejectedByPartner',
  402: 'rejectedByCashbuzz',
  406: 'payoutError',
  600: 'limitExceeded'
};

export const getStatus = (code: number): string => i18nInstance.t(
  `cashback.status_codes.${CASHBACK_CODES[code as keyof typeof CASHBACK_CODES]}`,
  {
    defaultValue: i18nInstance.t('cashback.status_codes.unknown')
  }
);
