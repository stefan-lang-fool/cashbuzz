import React from 'react';
import { useTranslation } from 'react-i18next';

import StrengthBar from './StrengthBar';
import { getPasswordStrength } from '@/utils/validation';

interface Props {
  password: string;
}

const PasswordStrengthBar = ({ password }: Props): JSX.Element => {
  const { t } = useTranslation();
  const score = getPasswordStrength(password || '');

  return (
    <StrengthBar
      init={ [
        { color: 'darkred', message: t('password_strength.too_short') },
        { color: 'orangered', message: t('password_strength.weak') },
        { color: 'orange', message: t('password_strength.okay') },
        { color: 'yellowgreen', message: t('password_strength.strong') },
        { color: 'green', message: t('password_strength.stronger') }
      ] }
      score={ score }
      showScore={ !!password?.length }
    />
  );
};


export default PasswordStrengthBar;
