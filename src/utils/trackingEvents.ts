/* eslint-disable import/prefer-default-export */

import APIService from '@/services/APIService';
import { MenuLabelsType } from '@/types';

const ROOT = 'cb_webapp';
const MENU = 'm#';
const SECTION = 's#';
const LANDING = 'landingpage';
const LOGIN = 'login';
const REGISTER = 'register';
const GUIDED = 'guided';
const TRADER_DOCUMENTS = 'trader_documents';
const TRADER_REPORTS = 'trader_reports';

export const bankConnection = {
  sendBankConnectionChosenEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection',
    blz: string
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, `chosen_${blz}`);
  },
  sendBankShortcutClickedEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection',
    bankName: string
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, `shortcut_${bankName}`);
  },
  sendBankConnectionOpenedEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection'
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, 'connection_opened');
  },
  sendBankConnectionDataRetrievedEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection'
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, 'connection_retrieved');
  },
  sendBankConnectionDataAnalyzedEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection'
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, 'connection_analyzed');
  },
  sendBankConnectionDataPreparedEvent: async (
    partnerId: number,
    menu: 'general-connection' | 'sme-connection' | 'trader-connection'
  ): Promise<void> => {
    await sendItemEvent(partnerId, menu, 'connection_prepared');
  }
};

export const documents = {
  sendDocumentUploadedEvent: async (partnedId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnedId}_${MENU}${TRADER_DOCUMENTS}_${SECTION}dragdrop_uploaded`);
  },
  sendDocumentDeletedEvent: async (partnedId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnedId}_${MENU}${TRADER_DOCUMENTS}_${SECTION}document_deleted`);
  },
  sendDocumentDownloadedEvent: async (partnedId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnedId}_${MENU}${TRADER_DOCUMENTS}_${SECTION}document_downloaded`);
  },
  sendDocumentViewedEvent: async (partnedId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnedId}_${MENU}${TRADER_DOCUMENTS}_${SECTION}document_viewed`);
  },
  sendDocumentSelectedEvent: async (partnedId: number, nrOfDocs: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnedId}_${MENU}${TRADER_DOCUMENTS}_${SECTION}dragdrop_selected_${nrOfDocs}`);
  }
};

export const guidedTour = {
  sendUserLandedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}landed`);
  },
  sendAccountCreatedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}account-created`);
  },
  sendAccountValidatedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}account-validated`);
  },
  sendDataEnteredEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}data-entered`);
  },
  sendTermsAcceptedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}terms-accepted`);
  },
  sendBankShortcutClickedEvent: async (partnerId: number, bankName: string): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}shortcut_${bankName}`);
  },
  sendBankConnectionChosenEvent: async (partnerId: number, blz: string): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}chosen_${blz}`);
  },
  sendBankConnectionOpenedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}connection_opened`);
  },
  sendBankConnectionDataRetrievedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}connection_retrieved`);
  },
  sendBankConnectionDataAnalyzedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}connection_analyzed`);
  },
  sendBankConnectionDataPreparedEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${GUIDED}_${SECTION}connection_prepared`);
  }
};

export const traderReports = {
  sendBackButtonClickEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${TRADER_REPORTS}_${SECTION}preview_back`);
  },
  sendContinueButtonClickEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${TRADER_REPORTS}_${SECTION}calendar_continue`);
  },
  sendPrintButtonClickEvent: async (partnerId: number): Promise<void> => {
    await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${TRADER_REPORTS}_${SECTION}preview_print`);
  }
};

export const sendItemEvent = async (partnerId: number, menu: MenuLabelsType, label: string): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${menu}_${SECTION}${label}`);
};

export const sendBookingItemEvent = async (
  partnerId: number,
  menu: 'general-transactions' | 'sme-transactions' | 'trader-transactions',
  type: 'future' | 'past'
): Promise<void> => {
  await sendItemEvent(partnerId, menu, type === 'future' ? 'next_bookings' : 'past_bookings');
};

export const sendDashboardEvent = async (partnerId: number): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}dashboard`);
};

export const sendLandingPageEvent = async (partnerId: number, referer?: string): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${LANDING}${referer ? `_${referer}` : ''}`);
};

export const sendMenuEvent = async (partnerId: number, menu: MenuLabelsType): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${MENU}${menu}`);
};

export const sendOnLoginButtonClickEvent = async (partnerId: number): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${LOGIN}`);
};

export const sendOnRegisterButtonClickEvent = async (partnerId: number): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_${REGISTER}`);
};

export const sendPasswordResetEvent = async (partnerId: number, email: string): Promise<void> => {
  await APIService.events.sendEvent(`${ROOT}_${partnerId}_password_reset`, email);
};
