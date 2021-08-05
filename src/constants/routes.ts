const AUTHORIZED = {
  ADD_BANK_CONNECTION: '/new-bank-connection',
  AFFINITIES: '/affinities',
  ATTRIBUTES: '/attributes',
  BANK_ACCOUNTS: '/bank-accounts',
  CASH_BACKS: '/cashbacks',
  CODE: '/code',
  CONTRACTS: '/contracts',
  DASHBOARD: '/',
  DOCUMENTS: '/documents',
  EXPENSES: '/expenses',
  FAQ: '/faq',
  INCOME: '/income',
  INVOICES: '/invoices',
  INVOICES_CREATE: '/invoices/create',
  PROFIT_AND_LOSS: '/profit-and-loss',
  REPORTS: '/reports',
  SECURITIES: '/securities',
  SETTINGS: '/settings',
  TRADES: '/trades',
  TRANSACTIONS: '/bookings',
  VOUCHERS: '/vouchers',
  CATEGORY_TREE: '/category-tree',
  REGIOS: '/regios'
};

const COMMON = {
  CREDITS: '/credits',
  IMPRINT: '/imprint',
  ONBOARDING: '/guided',
  PARTNER_POLICY: '/partner-policy',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_AND_CONDITIONS: '/terms-and-conditions'
};

const UNAUTHORIZED = {
  LOGIN: '/login',
  REGISTER: '/register'
};

export default { AUTHORIZED, COMMON, UNAUTHORIZED };
