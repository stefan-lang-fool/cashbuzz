/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankInterfaceOptionType, DocumentStatusType, Nullable } from '@/types';

/* eslint-disable camelcase */
export interface Account {
  accountName: string;
  accountNumber: string;
  accountTypeId: number;
  balance: Nullable<number>;
  bankConnectionId: number;
  categorization_status: number;
  cb_id: string;
  iban: string;
  id: number;
  interfaces: BankInterface[];
  is_selected: Nullable<boolean>;
  is_synthetic: Nullable<boolean>;
  lastSuccessfulUpdate: Nullable<string>;
  last_synced: string;
  status: Nullable<string>;
}

export interface Action<Type> {
  type: string;
  data?: Type;
}

export interface Affinity {
  class: string;
  month: number;
  affinity: number;
}

export interface Attribute {
  description: Nullable<string>;
  group: string;
  group_de: string;
  group_en: string;
  name: string;
  name_de: string;
  name_en: string;
  order_number: number;
  section: string;
  section_de: string;
  section_en: string;
  type: string;
}

export interface Bank {
  bic: string;
  blz: string;
  blzs: string[];
  city: string;
  id: number;
  interfaces: BankConnectionInterface[];
  isSupported: number;
  isTestBank: number;
  location: string;
  name: string;
  popularity: number;
}

export interface BankConnection {
  accountIds: number[];
  bank: Bank;
  id: number;
  updateStatus: string;
}

export interface BankConnectionInterface {
  interface: BankInterfaceOptionType;
}

export interface BankInterface {
  capabilities: string[];
  interface: BankInterfaceOptionType;
  lastSuccessfulUpdate: Nullable<string>;
  lastUpdateAttempt: string;
  status: string;
}

export interface Cashback {
  bigIcon: string;
  currency: string;
  expiry_date: string;
  id: number;
  logo: string;
  partnerId: number;
  partnerName: string;
  redeemdate: string;
  reward: number;
  rewardText: string;
  sqrdIcon: string;
  statusCode: number;
  transaction_amount: number;
  value_date: string;
  payout_value_date: Nullable<string>;
  cashback_context: string;
}

export interface CashbuzzData {
  contact: string;
  credits: string;
  gdp: string;
  gdpLink: string;
  impressum: string;
  tosLink: string;
  tospp: string;
}

export interface Contract {
  amount_median: number;
  amount_total: number;
  class: string;
  contract_ident: Nullable<string>;
  currency: string;
  customer_ident: Nullable<string>;
  end_date: Nullable<string>;
  group_gcon: Nullable<string>;
  group_gstd: Nullable<string>;
  id: string;
  last_transaction: string;
  org_id?: Nullable<string>;
  periodicity: Nullable<number>;
  qaction: Nullable<string>;
  qme: Nullable<string>;
  qorg: Nullable<string>;
  qsubject: Nullable<string>;
  start_date: string;
  transaction_count: number;
}

export interface DescriptionClass {
  description: string;
  expanded: string;
  label: string;
  name: string;
  title_de: string;
  title_en: string;
}

export interface Document {
  cashback_id: Nullable<string>;
  cashback_count: Nullable<number>;
  document_type: Nullable<string>;
  file_name: string;
  file_status: DocumentStatusType;
  id: string;
  organization_id?: Nullable<string>;
  upload_ts: string;
}

export interface EditUserProfileData {
  address?: string;
  birthday?: string;
  firstname?: string;
  lastname?: string;
  language?: string;
  send_reminders?: boolean;
}

export interface FinanceGroup {
  amount: number;
  id: number;
  label: string;
  month: string;
  path: string;
}

export interface FinancialGroup {
  description: string;
  label: string;
  name: string;
  title_de: string;
  title_en: string;
}

export interface GetAffinitiesResponseData {
  affinities: Affinity[];
  paging: Pagination;
}

export interface GetAttributesResponseData {
  attributes: Attribute[];
  paging: Pagination;
}

export interface GetBanksResponseData {
  banks: Bank[];
  paging: Pagination;
}

export interface GetCashbacksResponseData {
  cashbacks: Cashback[];
  paging: Pagination;
}

export interface GetClassesResponseData {
  classes: DescriptionClass[];
  paging: Pagination;
}

export interface GetContractsResponseData {
  contracts: Contract[];
  paging: Pagination;
}

export interface GetBankConnectionsResponseData {
  connections: BankConnection[];
}

export interface GetDataResponseData {
  cashback_amounts: {
    amount_0: number;
    'amount_-1': number;
    'amount_-2': number;
    'amount_-3': number;
    amount_total: number;
  };
  cashback_counts: {
    count_0: number;
    'count_-1': number;
    'count_-2': number;
    'count_-3': number;
    count_total: number;
  };
  onemarkets_bought: {
    amount_0: number;
    'amount_-1': number;
    'amount_-2': number;
    'amount_-3': number;
    amount_total: number;
  };
  onemarkets_sold: {
    amount_0: number;
    'amount_-1': number;
    'amount_-2': number;
    'amount_-3': number;
    amount_total: number;
  };
  onemarkets_top: {
    abs_amount: number;
    count: number;
    wkn: string;
  }[];
  securities_bought: {
    amount_0: number;
    'amount_-1': number;
    'amount_-2': number;
    'amount_-3': number;
    amount_total: number;
  };
  securities_sold: {
    amount_0: number;
    'amount_-1': number;
    'amount_-2': number;
    'amount_-3': number;
    amount_total: number;
  };
}

export interface GetDocumentsResponseData {
  documents: Document[];
  paging: Pagination;
}

export interface GetFinanceGroupsResponseData {
  finance_groups: FinanceGroup[];
  paging: Pagination;
}

export interface GetFinancialGroupsResponseData {
  f_groups: FinancialGroup[];
  paging: Pagination;
}

export interface GetInvoicesResponseData {
  invoices: Invoice[];
  paging: Pagination;
}

export interface GetQClassesResponseData {
  qclasses: DescriptionQClass[];
  paging: Pagination;
}

export interface GetSecuritiesResponseData {
  paging: Pagination;
  securities: Security[];
}

export interface GetSignalsResponseData {
  signals: Signal[];
}

export interface GetSubscriptionsResponseData {
  paging: Pagination;
  subscriptions: Subscription[];
}

export interface GetSuggestionsResponseData {
  paging: Pagination;
  hints: Suggestion[];
}

export interface GetTransactionsResponseData {
  balance: number;
  income: number;
  paging: Pagination;
  spending: number;
  transactions: Transaction[];
}

export interface GetUserAttributesResponseData {
  attributes: UserAttribute[];
  paging: Pagination;
}

export interface GetVouchersResponseData {
  paging: Pagination;
  vouchers: Voucher[];
}

export interface Invoice {
  id: string;
  org_id: string;
  org_name: string;
  invoice_date: string;
  payment_date: Nullable<string>;
  invoice_ident: string;
  due_date: string;
  customer_ident: string;
  remarks: Nullable<any>;
  gross_amount: number;
  net_amount: Nullable<number>;
  is_creditor: Nullable<boolean>;
  custom_org_name: string;
  ibans: Nullable<string>;
  custom_address: Nullable<any>;
  payment_transaction: Nullable<string>;
}

export interface InvoiceRequestData {
  invoice_date: string;
  gross_amount: number;
  invoice_ident: string;
  payment_date?: Nullable<string>;
  due_date: string;
  custom_org_name?: string;
  customer_ident?: string;
  custom_address?: any;
  org_id?: string;
  payment_transaction?: Nullable<string>;
}

export interface Suggestion {
  // message_type: 'mt_signal' | 'mt_warning' | 'mt_info' | 'mt_reminder' | 'mt_other';
  hint_location: 'status_bar' | 'hint_box';
  order_nr: number | null;
  hint_title: React.ReactNode;
  message_type: string;
  relevance_date: string;
  expiry_date: string | null;
  subject_type: string;
  hint_body: React.ReactNode;
}

export interface ImportBankConnectionResponseData {
  'callback-url': string;
  id: string;
  uri?: string;
  'web-form-token': string;
}

export interface LiquidityChartData {
  data: LiquidityPeriod[];
  max: number;
  min: number;
}

export interface LiquidityPeriod {
  balance: number;
  end: Date;
  expenses: number;
  income: number;
  predicted: boolean;
  start: Date;
}

export interface LoginResponseData {
  authkey: string;
  email: string;
  id: string;
  password: string;
  refreshtoken: string;
}

export interface Organization {
  address: { address: string };
  class: string;
  id: string;
  generic?: Nullable<boolean>;
  name: string;
  rating_color: 'green' | 'yellow' | 'red' | 'black' | 'white';
  uri: Nullable<string>;
}

export interface Pagination {
  page: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

export interface Partner {
  autoredemption: boolean;
  bigLogo: string;
  enforce_account_selection: boolean;
  id: number;
  longDescription: string;
  name: string;
  privacyPolicy: string;
  squaredLogo: string;
  styling: string;
  termsOfService: string;
  torLink: null | string;
  tosStatus: boolean;
  tosppVersion: number;
}

export interface DescriptionQClass {
  category_path: string;
  description: string;
  label: string;
  label_de: string;
  label_en: string;
  label_path: string;
  order_nr?: number;
}

export interface DescriptionQClassSingle {
  label_de: string;
  label_en: string;
}

export interface RequestChangeResponseData {
  changeToken: string;
}

export interface Security {
  accountId: string;
  entryQuote: number;
  entryQuoteCurrency: string;
  id: string;
  isin: string;
  marketValue: number;
  marketValueCurrency: string;
  market_value_in_user_currency: number;
  name: string;
  profitOrLoss: Nullable<string>;
  quantityNominal: number;
  quantityNominalType: string;
  quote: number;
  quoteCurrency: string;
  quoteDate: string;
  quoteType: string;
  wkn: string;
}

export interface Signal {
  amount: number;
  category: string;
  date: string;
  partner: string;
  schedule: string;
  signal: string;
}

export interface Styling {
  colors?: {
    accent?: string;
    background?: string;
    bodyText?: string;
    error?: string;
    headings?: string;
    inactiveText?: string;
    neutral?: string;
    primary?: string;
    secondary?: string;
    success?: string;
  };
  fontFamily?: string;
  logo?: string;
  sizes?: {
    large?: string;
    semiLarge?: string;
    medium?: string;
    semiSmall?: string;
    small?: string;
  };
}

export interface Subscription {
  amount_median: number;
  amount_total: number;
  class: string;
  currency: string;
  end_date: Nullable<string>;
  group_gcon: Nullable<string>;
  group_gstd: Nullable<string>;
  id: string;
  last_transaction: string;
  org_id?: Nullable<string>;
  periodicity: Nullable<number>;
  qaction: Nullable<string>;
  qme: Nullable<string>;
  qorg: Nullable<string>;
  qsubject: Nullable<string>;
  start_date: string;
  transaction_count: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Transaction {
  accountId: number;
  amount: number;
  bankBookingDate: string;
  category: Nullable<TransactionCategory>;
  cb_id: string;
  class: string;
  counterpartIban: string;
  counterpartMandateReference: string;
  counterpartName: string;
  displayCurrency: string;
  group_gcon: Nullable<string>;
  group_gstd: Nullable<string>;
  id: string;
  multipurpose_data: Nullable<string>;
  qaction: Nullable<string>;
  qme: Nullable<string>;
  qorg: Nullable<string>;
  qsubject: Nullable<string>;
  org_id?: Nullable<string>;
  predicted: boolean;
  purpose: string;
  valueDate: string;
}

export interface TransactionCategory {
  children: null;
  id: number;
  isCustom: boolean;
  name: string;
  parentId: number;
  parentName: string;
}

export interface User {
  address: string;
  authKey: string;
  birthday: string;
  currency: string;
  email: string;
  firstname: string;
  id: string;
  language: string;
  lastname: string;
  mgm_key: null | string;
  onboarded_by: number;
  password: string;
  phone: string;
  send_reminders: boolean;
}

export interface UserAttribute {
  attribute_group: string;
  attribute_name: string;
  attribute_section: string;
  type_details: Nullable<string>;
  valid_date: string;
  value: Nullable<any>;
  value_type: string;
}

export interface Voucher {
  category: string;
  code: string;
  currency: string;
  discountAmount: number;
  id: number;
  isPercentage: boolean;
  logoPath: string;
  longDescription: string;
  shopId: number;
  shopName: string;
  title: string;
  uri: string;
  voucherText: string;
  voucherType: number;
}
