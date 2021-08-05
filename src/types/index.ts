export type Nullable<T> = null | T;

export type PropsWithClassName<T> = T & {
  className?: string;
}

export type ConsumerType = 'sme' | 'general' | 'trader';
export type BankInterfaceOptionType = 'FINTS_SERVER' | 'WEB_SCRAPER' | 'XS2A';

export type DocumentStatusType = 'uploaded' | 'rejected' | 'verified' | 'checked_cashback';
export type DocumentType = 'trade_settlement';

export type MenuLabelsGeneralType =
  'general-accounts' |
  'general-affinities' |
  'general-attributes' |
  'general-connection' |
  'general-contact' |
  'general-contracts' |
  'general-expenses' |
  'general-income' |
  'general-logout' |
  'general-category-tree' |
  'general-overview' |
  'regios-overview' |
  'general-profile' |
  'general-profitloss' |
  'general-transactions' |
  'general-vouchers';

export type MenuLabelSmeType =
  'sme-connection' |
  'sme-contracts' |
  'sme-expenses' |
  'sme-faq' |
  'sme-income' |
  'sme-invoices' |
  'sme-overview' |
  'sme-profile' |
  'sme-profitloss' |
  'sme-transactions'

export type MenuLabelTraderType =
  'trader-cashback' |
  'trader-connection' |
  'trader-documents' |
  'trader-faq' |
  'trader-mgm' |
  'trader-overview' |
  'trader-profile' |
  'trader-reports' |
  'trader-securities' |
  'trader-trades' |
  'trader-transactions';

export type MenuLabelPocketType =
  'pocket-flowerchart-test' |
  'pocket-transactions';

export type MenuLabelsType =
MenuLabelsGeneralType |
MenuLabelSmeType |
MenuLabelTraderType |
MenuLabelPocketType |
'separator';
