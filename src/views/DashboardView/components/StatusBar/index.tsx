/* eslint-disable max-len */
import { Divider, Link } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import Card, { CardType } from './components/Card';
import { ROUTES } from '@/constants';
import { Account, BankConnection, GetDataResponseData, Suggestion } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { to6391Format } from '@/utils/languages';
import { messageTypeToClass, subjectTypeToIcon } from '@/utils/suggestions';

interface Props {
  accounts: Account[];
  messages: Suggestion[];
  showDevider?: boolean;
  traderData?: GetDataResponseData;
  type: 'SME' | 'TRADER' | 'GENERAL';
}

const typeToTranslation: { [statusBarType: string ]: string } = {
  SME: 'sme',
  TRADER: 'trader',
  GENERAL: 'general'
};

const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

const StatusBar = ({ accounts, showDevider = true, traderData, messages, type }: Props): JSX.Element => {
  const history = useHistory();
  const { t, i18n: i18nInstance } = useTranslation();

  const shouldEnforceAccountSelection = useSelector((appState: AppState) => appState.cashbuzz.enforceAccountSelection);
  const userId = useSelector((state: AppState) => state.auth.user?.id);

  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);

  const accountsToResync = useMemo(() => accounts.filter((singleAccount) => singleAccount.categorization_status !== 0), [accounts]);
  const hasConnectedAccounts = useMemo(() => !!accounts.length, [accounts]);
  const hasUnselectedAccounts = useMemo(() => accounts.find((singleAccount) => singleAccount.is_selected === null), [accounts]);
  const shouldWelcomeCardOccur = useMemo(() => {
    const registerDate = localStorage.getItem('register-time');
    const registerObject = JSON.parse(registerDate || '{}');
    const hasRegistrationDate = Object.keys(registerObject).find((key) => key === userId);


    return userId && hasRegistrationDate
      ? (new Date().getTime() - new Date(registerObject[userId]).getTime()) < FOUR_DAYS
      : false;
  }, [userId]);


  const allMessages = useMemo(() => {
    const localMessages = [...messages];

    if (shouldWelcomeCardOccur) {
      localMessages.push({
        expiry_date: null,
        hint_body: t(`overview.${typeToTranslation[type]}.status-bar.new-user-welcome.description`),
        hint_location: 'status_bar',
        hint_title: t(`overview.${typeToTranslation[type]}.status-bar.new-user-welcome.title`),
        message_type: 'welcome',
        order_nr: 100,
        relevance_date: '',
        subject_type: 'welcome'
      });
    }

    if (!hasConnectedAccounts) {
      localMessages.push({
        expiry_date: null,
        hint_body: (
          <Trans i18nKey={ `overview.${typeToTranslation[type]}.status-bar.no-connection.description` }>
            <Link
              onClick={ (): void => {
                history.push(ROUTES.AUTHORIZED.ADD_BANK_CONNECTION);
              } }
            />
            <Link
              onClick={ (): void => {
                history.push(ROUTES.AUTHORIZED.DOCUMENTS);
              } }
            />
          </Trans>
        ),
        hint_location: 'status_bar',
        hint_title: t(`overview.${typeToTranslation[type]}.status-bar.no-connection.title`),
        message_type: 'connect',
        order_nr: 200,
        relevance_date: '',
        subject_type: 'connect'
      });
    } else if (accountsToResync.length && bankConnections.length) {
      localMessages.push({
        expiry_date: null,
        hint_body: t(
          `overview.${typeToTranslation[type]}.status-bar.need-resync.description`,
          { accounts: accountsToResync.map((singleAccount) => `${bankConnections.find((singleBankConnection) => singleBankConnection.id === singleAccount.bankConnectionId)?.bank.name}${singleAccount.accountName ? ` (${singleAccount.accountName})` : ''}`).join(', ') }
        ),
        hint_location: 'status_bar',
        hint_title: t(`overview.${typeToTranslation[type]}.status-bar.need-resync.title`),
        message_type: 'resync',
        order_nr: 300,
        relevance_date: '',
        subject_type: 'resync'
      });
    }

    if (hasUnselectedAccounts && shouldEnforceAccountSelection) {
      localMessages.push({
        expiry_date: null,
        hint_body: t(`overview.${typeToTranslation[type]}.status-bar.need-account-selection.description`),
        hint_location: 'status_bar',
        hint_title: t(`overview.${typeToTranslation[type]}.status-bar.need-account-selection.title`),
        message_type: 'accountVisibility',
        order_nr: 400,
        relevance_date: '',
        subject_type: 'accountVisibility'
      });
    }

    if (type === 'TRADER' && hasConnectedAccounts) {
      localMessages.push({
        expiry_date: null,
        hint_body: t('overview.trader.status-bar.cashbacks.description', {
          cashback_number: traderData?.cashback_counts.count_total,
          cashback_amount: new Intl.NumberFormat(to6391Format(i18nInstance.language), {
            style: 'currency',
            currency: 'EUR'
          }).format(traderData?.cashback_amounts.amount_total || 0)
        }),
        hint_location: 'status_bar',
        hint_title: t('overview.trader.status-bar.cashbacks.title'),
        message_type: 'cashbacks',
        order_nr: 500,
        relevance_date: '',
        subject_type: 'cashbacks'
      });
    }

    return localMessages;
  }, [
    accountsToResync,
    bankConnections,
    hasConnectedAccounts,
    hasUnselectedAccounts,
    history,
    i18nInstance.language,
    messages,
    shouldEnforceAccountSelection,
    shouldWelcomeCardOccur,
    t,
    traderData,
    type
  ]);

  useEffect(() => {
    (async (): Promise<void> => {
      const tempObject: {[key: string]: BankConnection} = {};
      if (accountsToResync.length) {
        const bankConnectionIds = Array.from(new Set(accountsToResync.map((singleAccount) => singleAccount.bankConnectionId)));

        await Promise.all(bankConnectionIds.map(async (id) => {
          const { data } = await APIService.bankConnections.get(id);

          if (!tempObject[data.id]) {
            tempObject[data.id] = data;
          }
        }));
      }

      setBankConnections(Object.values(tempObject));
    })();
  }, [accountsToResync]);

  return (
    <>
      { allMessages.sort((a, b) => (
        (a.order_nr !== null && a.order_nr !== undefined ? a.order_nr : Infinity) - (b.order_nr !== null && b.order_nr !== undefined ? b.order_nr : Infinity)
      )).map((message, index) => (
        <Card
          key={ `suggestion-${index}` }
          icon={ subjectTypeToIcon[message.subject_type] }
          text={ message.hint_body }
          title={ message.hint_title }
          type={ messageTypeToClass[message.message_type] as CardType || message.message_type }
        />
      )) }
      { !!allMessages.length && showDevider && <Divider style={ { marginTop: '40px', marginBottom: '40px' } } /> }
    </>
  );
};

export default StatusBar;
