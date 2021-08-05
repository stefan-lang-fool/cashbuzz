/* eslint-disable import/prefer-default-export */
import { ICONS } from '@/assets';

export const subjectTypeToIcon: { [subjectType: string]: string } = {
  st_account: ICONS.CHART_BAR,
  st_contract: ICONS.FILE_DOCUMENT_OUTLINE,
  st_creditor: ICONS.CHEVRON_DOWN_BOX_OUTLINE,
  st_debitor: ICONS.CHEVRON_UP_BOX_OUTLINE,
  st_general: ICONS.INFORMATION,
  st_other: ICONS.CHAT,
  st_tax: ICONS.HOME_CURRENCY
};

export const messageTypeToClass: { [messageType: string]: string } = {
  mt_signal: 'primary',
  mt_warning: 'warning',
  mt_info: 'other',
  mt_reminder: 'other',
  mt_other: 'other'
};
