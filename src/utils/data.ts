/* eslint-disable import/prefer-default-export */
import i18n from '@/i18n';
import { Nullable } from '@/types';

export const getText = (text?: Nullable<string>): string => text || i18n.t('common.not_available');
