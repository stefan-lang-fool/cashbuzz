import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

import UnauthorizedLayout from '@/Layouts/UnauthorizedLayout';
import { AppState } from '@/reducers';

const PrivacyPolicyView = (): JSX.Element => {
  const { t } = useTranslation();
  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  return (
    <div>
      <UnauthorizedLayout title={ t('menu.privacy_policy') }>
        <ReactMarkdown source={ cashbuzzData?.gdp } />
      </UnauthorizedLayout>
    </div>
  );
};

export default PrivacyPolicyView;
