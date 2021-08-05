/* eslint-disable import/prefer-default-export */
import { ValidationOption } from 'react-hook-form/dist/types';

import i18n from '@/i18n';

export const setFieldAsRequired = (fieldName: 'general' | 'checkbox'): ValidationOption<boolean> => ({ value: true, message: i18n.t(`validation.required.${fieldName}`) });
