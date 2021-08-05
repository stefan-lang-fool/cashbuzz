import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import UnauthorizedLayout from '@/Layouts/UnauthorizedLayout';
import { loading, closeLoading } from '@/components/CustomLoader';
import Credits from '@/resources/credits.md';

const CreditsView = (): JSX.Element => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadingId = loading();

    fetch(Credits).then((response) => response.text())
      .then((text) => {
        setContent(text);
        closeLoading(loadingId);
      });
  }, []);

  return (
    <div>
      <UnauthorizedLayout title={ t('menu.credits') }>
        <ReactMarkdown source={ content } />
      </UnauthorizedLayout>
    </div>
  );
};

export default CreditsView;
