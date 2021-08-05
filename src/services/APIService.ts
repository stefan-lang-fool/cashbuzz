/* eslint-disable no-await-in-loop */
import { AxiosPromise } from 'axios';
import {
  addMonths,
  format,
  subMonths
} from 'date-fns';

import http from '@/http';
import {
  Account,
  BankConnection,
  CashbuzzData,
  EditUserProfileData,
  GetAffinitiesResponseData,
  GetAttributesResponseData,
  GetBankConnectionsResponseData,
  GetBanksResponseData,
  GetCashbacksResponseData,
  GetClassesResponseData,
  GetContractsResponseData,
  GetDataResponseData,
  GetDocumentsResponseData,
  GetFinanceGroupsResponseData,
  GetQClassesResponseData,
  GetSecuritiesResponseData,
  GetSignalsResponseData,
  GetSubscriptionsResponseData,
  GetSuggestionsResponseData,
  GetTransactionsResponseData,
  GetUserAttributesResponseData,
  GetVouchersResponseData,
  ImportBankConnectionResponseData,
  LoginResponseData,
  Organization,
  Partner,
  RequestChangeResponseData,
  User,
  GetInvoicesResponseData,
  Invoice,
  InvoiceRequestData,
  Transaction,
  Subscription
} from '@/interfaces';
import { BankInterfaceOptionType, ConsumerType, DocumentType } from '@/types';

// List of endpoints
export const ENDPOINTS = {
  ACCOUNTS: '/accounts',
  ADDRESSES: '/addresses',
  BANKS: '/banks',
  BANK_CONNECTIONS: '/bankConnections',
  CASHBACKS: '/cashbacks',
  CASHBUZZ: '/cashbuzz',
  CATEGORIZATION: '/categorization',
  CONTRACTS: '/contracts',
  DATA: '/data',
  DESCRIPTIONS: '/descriptions',
  DOCUMENTS: '/documents',
  EVENTS: '/events',
  INVOICES: '/invoices',
  ME: '/users/me',
  OAUTH: '/oauth',
  ORGANIZATIONS: '/organizations',
  PARTNERS: '/partners',
  REGIOS: '/users/regiox',
  SECURITIES: '/securities',
  SIGNALS: '/signals',
  SUBSCRIPTIONS: '/subscriptions',
  SUGGESTIONS: '/suggestions',
  TRANSACTIONS: '/transactions',
  USERS: '/users',
  VOUCHERS: '/vouchers'
};

/**
 * Object containing all account requests
 */
const account = {
  delete(id: number): AxiosPromise {
    return http.delete(`${ENDPOINTS.ACCOUNTS}/${id}`);
  },

  get(id: number): AxiosPromise<Account> {
    return http.get(`${ENDPOINTS.ACCOUNTS}/${id}`);
  },

  getAll(): AxiosPromise<{ accounts: Account[] }> {
    return http.get(ENDPOINTS.ACCOUNTS);
  },

  updateIsSelected(id: string, value: boolean): AxiosPromise {
    return http.patch(`${ENDPOINTS.ACCOUNTS}/${id}`, {
      is_selected: value
    });
  }
};

/**
* Object containing all addresses requests
*/
const addresses = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAddress(address: string): AxiosPromise<any> {
    return http.post(ENDPOINTS.ADDRESSES, { address });
  }
};

/**
* Object containing all affinities requests
*/
const affinities = {
  getAll(page = 1, perPage = 10, classes?: string[]): AxiosPromise<GetAffinitiesResponseData> {
    return http.get(`${ENDPOINTS.USERS}/affinities`, {
      params: {
        page,
        perPage,
        classes: classes?.join(',')
      }
    });
  }
};

/**
 * Object containing all authentication requests
 */
const authentication = {
  checkUserVerificationStatus(userId: string): AxiosPromise<{userId: string; isUserVerified: boolean}> {
    return http.get(`${ENDPOINTS.USERS}/${userId}/verificationStatus`);
  },

  logInUser(email: string, password: string): AxiosPromise<LoginResponseData> {
    return http.post(`${ENDPOINTS.USERS}?login=true`, { email, password });
  },

  logout(): AxiosPromise {
    return http.post(`${ENDPOINTS.ME}/logout`);
  },

  me(): AxiosPromise<User> {
    return http.get(ENDPOINTS.ME);
  },

  register(
    email: string,
    password: string,
    policyAcceptance: boolean,
    language?: string,
    onboarded_by?: number,
    campaing?: string
  ): AxiosPromise {
    return http.post(`${ENDPOINTS.USERS}?login=false${campaing ? `&campaign=${campaing}` : ''}`, {
      email,
      password,
      language,
      onboarded_by,
      tosaccepted: policyAcceptance
    });
  },

  resetPasswordConfirmation(changeToken: string, email: string, password: string): AxiosPromise {
    return http.post(`${ENDPOINTS.ME}/executePasswordChange`, { changeToken, email, password });
  },

  resetPasswordRequest(email: string): AxiosPromise {
    return http.post(`${ENDPOINTS.USERS}/requestNewPassword`, { email });
  },

  verifyEmail(validationcode: string): AxiosPromise {
    return http.post(ENDPOINTS.ME, { validationcode });
  }
};

/**
 * Object containing all banks requests
 */
const banks = {
  searchForBanks(search: string, page = 1, perPage = 10): AxiosPromise<GetBanksResponseData> {
    return http.get(ENDPOINTS.BANKS, {
      params: {
        isSupported: true,
        order: 'name,asc',
        page,
        perPage,
        search
      }
    });
  }
};

/**
 * Object containing all banks connection requests
 */
const bankConnections = {
  checkConnectionStatus(id: string): AxiosPromise {
    return http.get(`${ENDPOINTS.BANK_CONNECTIONS}/import/${id}`);
  },

  connectInterface(
    bankConnectionId: number,
    interfaceType: BankInterfaceOptionType
  ): AxiosPromise<ImportBankConnectionResponseData> {
    return http.post(`${ENDPOINTS.BANK_CONNECTIONS}/connectInterface`, {
      bankConnectionId,
      interface: interfaceType
    });
  },

  delete(id: number): AxiosPromise {
    return http.delete(`${ENDPOINTS.BANK_CONNECTIONS}/${id}`);
  },

  get(id: number): AxiosPromise<BankConnection> {
    return http.get(`${ENDPOINTS.BANK_CONNECTIONS}/${id}`);
  },

  getAll(): AxiosPromise<GetBankConnectionsResponseData> {
    return http.get(ENDPOINTS.BANK_CONNECTIONS);
  },

  importBankConnection(
    bankId: number,
    interfaceType?: BankInterfaceOptionType
  ): AxiosPromise<ImportBankConnectionResponseData> {
    return http.post(`${ENDPOINTS.BANK_CONNECTIONS}/import`, { bankId, interface: interfaceType });
  },

  updateBankConnection(
    bankConnectionId: number,
    interfaceType: BankInterfaceOptionType
  ): AxiosPromise<ImportBankConnectionResponseData> {
    return http.post(`${ENDPOINTS.BANK_CONNECTIONS}/update`, { bankConnectionId, interface: interfaceType });
  }
};

/**
* Object containing all cashbuzz requests
*/
const cashbacks = {
  getAll(page = 1, perPage = 10): AxiosPromise<GetCashbacksResponseData> {
    return http.get(ENDPOINTS.CASHBACKS, {
      params: {
        page,
        perPage
      }
    });
  },

  getTrades(page = 1, perPage = 1000000000): AxiosPromise<GetCashbacksResponseData> {
    return http.get(ENDPOINTS.CASHBACKS, {
      params: {
        page,
        perPage,
        statusCode: 200
      }
    });
  },

  initialize(id: number): AxiosPromise {
    return http.post(`${ENDPOINTS.CASHBACKS}/${id}`);
  }
};

/**
* Object containing all cashbuzz requests
*/
const cashbuzz = {
  acceptPolicy(): AxiosPromise {
    return http.post(ENDPOINTS.CASHBUZZ);
  },

  getInfo(id = 0): AxiosPromise<CashbuzzData> {
    return http.get(ENDPOINTS.CASHBUZZ, {
      params: {
        partner: id
      }
    });
  }
};

/**
* Object containing all cashbuzz requests
*/
const categorization = {
  recalculateSubscriptions(): AxiosPromise {
    return http.post(`${ENDPOINTS.CATEGORIZATION}?subscriptions_only=true`);
  }
};

/**
* Object containing all contract requests
*/
const contract = {
  getAll(page = 1, perPage = 10): AxiosPromise<GetContractsResponseData> {
    return http.get(ENDPOINTS.CONTRACTS, {
      params: {
        page,
        perPage
      }
    });
  }
};

/**
* Object containing all data requests
*/
const data = {
  get(): AxiosPromise<GetDataResponseData> {
    return http.get(ENDPOINTS.DATA);
  }
};

/**
* Object containing all description requests
*/
const description = {
  getAllAttributes(): AxiosPromise<GetAttributesResponseData> {
    return http.get(`${ENDPOINTS.DESCRIPTIONS}/attributes`, {
      params: {
        perPage: 1000
      }
    });
  },

  getAllClasses(): AxiosPromise<GetClassesResponseData> {
    return http.get(`${ENDPOINTS.DESCRIPTIONS}/classes`, {
      params: {
        perPage: 1000
      }
    });
  },

  getAllQClasses(): AxiosPromise<GetQClassesResponseData> {
    return http.get(`${ENDPOINTS.DESCRIPTIONS}/qclasses`, {
      params: {
        perPage: 10000
      }
    });
  },

  getOrganization(id: string): AxiosPromise<Organization> {
    return http.get(`${ENDPOINTS.DESCRIPTIONS}/organizations/${id}`);
  },

  getOrganizations(ids: string[]): AxiosPromise<Organization[]> {
    return http.get(`${ENDPOINTS.DESCRIPTIONS}/organizations/(${ids})`);
  }
};

const events = {
  sendEvent(name: string, attributes?: string): AxiosPromise {
    return http.post(`${ENDPOINTS.EVENTS}`, { attributes, name });
  }
};

/**
* Object containing all documents requests
*/
const documents = {
  delete(id: string): AxiosPromise {
    return http.delete(`${ENDPOINTS.DOCUMENTS}?id=${id}`);
  },

  get(id: string): AxiosPromise {
    return http.get(`${ENDPOINTS.DOCUMENTS}?id=${id}`);
  },

  getAll(type: DocumentType, page = 1, perPage = 10): AxiosPromise<GetDocumentsResponseData> {
    return http.get(ENDPOINTS.DOCUMENTS, {
      params: {
        page,
        perPage,
        type
      }
    });
  },

  upload(name: string, fileData: FormData, type: DocumentType): AxiosPromise {
    return http.post(`${ENDPOINTS.DOCUMENTS}?filename=${name}&document_type=${type}`, fileData);
  }
};

const organizations = {
  // Search by name
  getByName(name: string): AxiosPromise<Organization[]> {
    return http.get(ENDPOINTS.ORGANIZATIONS, {
      params: {
        name
      }
    });
  }
};

/**
* Object containing all invoices requests
*/
const invoices = {
  get(id: string): AxiosPromise<Invoice> {
    return http.get(`${ENDPOINTS.INVOICES}/${id}`);
  },

  getAll(page = 1, perPage = 10): AxiosPromise<GetInvoicesResponseData> {
    return http.get(ENDPOINTS.INVOICES, {
      params: {
        page,
        perPage
      }
    });
  },

  create(invoiceData: InvoiceRequestData): AxiosPromise {
    return http.post(ENDPOINTS.INVOICES, {
      ...invoiceData
    });
  },

  edit(id: string, invoiceData: InvoiceRequestData): AxiosPromise {
    return http.patch(`${ENDPOINTS.INVOICES}/${id}`, {
      ...invoiceData
    });
  },

  delete(id: string): AxiosPromise {
    return http.delete(`${ENDPOINTS.INVOICES}/${id}`);
  }
};

/**
 * Object containing all partners requests
 */
const partners = {
  acceptTOS(id: number): AxiosPromise {
    return http.post(`${ENDPOINTS.PARTNERS}/${id}`);
  },

  changeAutoRedemptionStatus(id: number, status: boolean): AxiosPromise {
    return http.post(`${ENDPOINTS.PARTNERS}/${id}?autoredemption=${status}`);
  },

  get(id: number): AxiosPromise<Partner> {
    return http.get(`${ENDPOINTS.PARTNERS}/${id}`);
  }
};

/**
* Object containing all securities requests
*/
const securities = {
  getAll(page = 1, perPage = 10): AxiosPromise<GetSecuritiesResponseData> {
    return http.get(ENDPOINTS.SECURITIES, {
      params: {
        page,
        perPage
      }
    });
  }
};

/**
* Object containing all signals requests
*/
const signals = {
  getAll(): AxiosPromise<GetSignalsResponseData> {
    return http.get(ENDPOINTS.SIGNALS);
  }
};

/**
* Object containing all subscriptions requests
*/
const subscriptions = {
  async getChartData(positive?: boolean): Promise<Subscription[]> {
    let page = 1;
    let maxPage = 1;
    let subscriptionList: Subscription[] = [];

    do {
      const { data: subscriptionsData } = await http.get(ENDPOINTS.SUBSCRIPTIONS, {
        params: {
          order: `amount_total,${positive ? 'desc' : 'asc'}`,
          page,
          perPage: 1000000000,
          positive_amount: positive
        }
      });

      subscriptionList = [...subscriptionList, ...subscriptionsData.subscriptions];
      maxPage = subscriptionsData.paging.pageCount;
      page += 1;
    } while (page < maxPage);

    return subscriptionList;
  },

  getAll(positive?: boolean, page = 1, perPage = 10): AxiosPromise<GetSubscriptionsResponseData> {
    return http.get(ENDPOINTS.SUBSCRIPTIONS, {
      params: {
        order: `amount_total,${positive ? 'desc' : 'asc'}`,
        page,
        perPage,
        positive_amount: positive
      }
    });
  },

  getAllWithoutContracts(page = 1, perPage = 10): AxiosPromise<GetSubscriptionsResponseData> {
    return http.get(ENDPOINTS.SUBSCRIPTIONS, {
      params: {
        no_contracts: true,
        page,
        perPage
      }
    });
  }
};

/**
* Object containing all suggestions requests
*/
const suggestions = {
  getAll(page = 1, perPage = 1000000000): AxiosPromise<GetSuggestionsResponseData> {
    return http.get(ENDPOINTS.SUGGESTIONS, {
      params: {
        page,
        perPage,
        is_relevant: true
      }
    });
  }
};

/**
 * Object containing all user requests
 */
const user = {
  changeEmail(email: string, newemail: string, changeToken: string): AxiosPromise {
    return http.post(`${ENDPOINTS.ME}/executeEmailChange`, { email, newemail, changeToken });
  },

  changePassword(email: string, password: string, changeToken: string): AxiosPromise {
    return http.post(`${ENDPOINTS.ME}/executePasswordChange`, { email, password, changeToken });
  },

  changeProfileData(profileData: EditUserProfileData): AxiosPromise<User> {
    return http.patch(ENDPOINTS.ME, profileData);
  },

  deleteAccount(): AxiosPromise {
    return http.delete(ENDPOINTS.ME);
  },

  getAttributes(page = 1, perPage = 1000): AxiosPromise<GetUserAttributesResponseData> {
    return http.get(`${ENDPOINTS.USERS}/attributes`, {
      params: {
        page,
        perPage
      }
    });
  },

  getChangeToken(email: string, password: string): AxiosPromise<RequestChangeResponseData> {
    return http.post(`${ENDPOINTS.ME}/requestChange`, { email, password });
  },

  getFinanceGroups(type: ConsumerType, from = subMonths(new Date(), 3), to = addMonths(new Date(), 3)): AxiosPromise<GetFinanceGroupsResponseData> {
    let fgroup;

    switch (type) {
      case 'sme':
        fgroup = 'gbix';
        break;
      case 'general':
      default:
        fgroup = 'gcix';
    }

    return http.get(`${ENDPOINTS.USERS}/f_groups`, {
      params: {
        from_month: format(from, 'yyyy-MM'),
        to_month: format(to, 'yyyy-MM'),
        fgroup,
        page: 1,
        perPage: 100000000
      }
    });
  },

  resendValidationCode(): AxiosPromise<void> {
    return http.patch(ENDPOINTS.ME, {});
  },

  triggerTransactionRefetch(userId: string): AxiosPromise<void> {
    return http.post(`/webForms/0?id=${userId}`);
  },

  useCode(code: string): AxiosPromise {
    return http.post(`${ENDPOINTS.ME}/code`, { code });
  }
};

/**
 * Object containing all voucher requests
 */
const voucher = {
  getAll(page = 1, perPage = 10): AxiosPromise<GetVouchersResponseData> {
    return http.get(ENDPOINTS.VOUCHERS, {
      params: {
        page,
        perPage
      }
    });
  }
};

/**
 * Object containing all transaction requests
 */
const transaction = {
  get(id: string): AxiosPromise<Transaction> {
    return http.get(`${ENDPOINTS.TRANSACTIONS}/${id}`);
  },

  async getOldestTransaction(): Promise<Transaction | null> {
    const { data: transactions } = await http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        minBankBookingDate: '1990-01-01',
        page: 1,
        perPage: 1,
        order: 'valueDate,asc',
        view: 'bankView'
      }
    });

    if (transactions.transactions && transactions.transactions.length) {
      return transactions.transactions[0];
    }

    return null;
  },

  getFutureTransactions(page = 1, perPage = 10, view = 'bankView'): AxiosPromise<GetTransactionsResponseData> {
    return http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        maxBankBookingDate: format(addMonths(new Date(), 3), 'yyyy-MM-dd'),
        only_predicted: true,
        page,
        perPage,
        order: 'valueDate,asc',
        view
      }
    });
  },

  getTrades(page = 1, perPage = 10, view = 'bankView'): AxiosPromise<GetTransactionsResponseData> {
    return http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        group_gstd: 'gtcp,gtis,gtmc,gtmv,gttt,gtsr',
        minBankBookingDate: '1990-01-01',
        page,
        perPage,
        order: 'valueDate,desc',
        view
      }
    });
  },

  getAll(page = 1, perPage = 10, view = 'bankView'): AxiosPromise<GetTransactionsResponseData> {
    return http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        minBankBookingDate: '1990-01-01',
        page,
        perPage,
        order: 'valueDate,desc',
        view
      }
    });
  },

  getAllByPeriod(minBankBookingDate: string, maxBankBookingDate: string, page = 1, perPage = 10, view = 'bankView'): AxiosPromise<GetTransactionsResponseData> {
    return http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        minBankBookingDate,
        maxBankBookingDate,
        page,
        perPage,
        order: 'valueDate,desc',
        view
      }
    });
  },

  getAllBySubscription(subscriptionId: string, page = 1, perPage = 1000000000, view = 'bankView'): AxiosPromise<GetTransactionsResponseData> {
    return http.get(ENDPOINTS.TRANSACTIONS, {
      params: {
        subscription_id: subscriptionId,
        minBankBookingDate: '1990-01-01',
        page,
        perPage,
        order: 'valueDate,desc',
        view
      }
    });
  }
};

const regios = {
  get(): AxiosPromise<any> {
    return http.get(ENDPOINTS.REGIOS);
  }
};

/**
 * Object containing all tokens requests
 */
const tokens = {
  revoke(refreshtoken: string): AxiosPromise<LoginResponseData> {
    return http.post(`${ENDPOINTS.USERS}?login=true`, { refreshtoken });
  }
};

export default {
  account,
  addresses,
  affinities,
  authentication,
  banks,
  bankConnections,
  cashbacks,
  cashbuzz,
  categorization,
  contract,
  data,
  description,
  documents,
  events,
  invoices,
  organizations,
  partners,
  regios,
  securities,
  signals,
  subscriptions,
  suggestions,
  tokens,
  transaction,
  user,
  voucher
};
