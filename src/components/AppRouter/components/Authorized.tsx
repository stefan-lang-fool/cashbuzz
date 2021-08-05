/* eslint-disable react/jsx-pascal-case */
import { useTheme } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { showNotification } from '@/components/Notification';
import { ROUTES } from '@/constants';
import { Account } from '@/interfaces';
import APIService from '@/services/APIService';
import AddNewBankConnection from '@/views/DashboardView/pages/AddNewBankConnection';
import Affinities from '@/views/DashboardView/pages/Affinities';
import Attributes from '@/views/DashboardView/pages/Attributes';
import BankAccounts from '@/views/DashboardView/pages/BankAccounts';
import Cashbacks from '@/views/DashboardView/pages/Cashbacks';
import CategoryTree from '@/views/DashboardView/pages/CategoryTree';
import Code from '@/views/DashboardView/pages/Code';
import GeneralContracts from '@/views/DashboardView/pages/Contracts/General';
import SMEContracts from '@/views/DashboardView/pages/Contracts/SME';
import CreateInvoice from '@/views/DashboardView/pages/CreateInvoice';
import Documents from '@/views/DashboardView/pages/Documents';
import EditInvoice from '@/views/DashboardView/pages/EditInvoice';
import General_Expenses from '@/views/DashboardView/pages/Expenses/General';
import SME_Expenses from '@/views/DashboardView/pages/Expenses/SME';
import General_Income from '@/views/DashboardView/pages/Income/General';
import SME_Income from '@/views/DashboardView/pages/Income/SME';
import Invoices from '@/views/DashboardView/pages/Invoices';
import GeneralOverview from '@/views/DashboardView/pages/Overview/General';
import SMEOverview from '@/views/DashboardView/pages/Overview/SME';
import TraderOverview from '@/views/DashboardView/pages/Overview/Trader';
import ProfitAndLoss from '@/views/DashboardView/pages/ProfitAndLoss';
import Reports from '@/views/DashboardView/pages/Reports';
import Securities from '@/views/DashboardView/pages/Securities';
import Settings from '@/views/DashboardView/pages/Settings';
import Trades from '@/views/DashboardView/pages/Trades';
import GeneralTransactions from '@/views/DashboardView/pages/Transactions/General';
import SMETransactions from '@/views/DashboardView/pages/Transactions/SME';
import TraderTransactions from '@/views/DashboardView/pages/Transactions/Trader';
import Vouchers from '@/views/DashboardView/pages/Vouchers';

import PocketTransactions from '@/views/POCKET/Transactions';
import TestFlower from '@/views/TestFlower';
import Regios from '@/views/DashboardView/pages/Regios';

const AuthorizedRouter = (): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();

  const [accountsStatus, setAccountsStatus] = useState<number>();
  const [accountsData, setAccountsData] = useState<Account[]>([]);

  const accountsStatusRef = useRef<number>();

  const withTree = useMemo(() => theme.custom.show_category_path, [theme]);
  const withPrediction = useMemo(() => theme.custom.show_predicted, [theme]);

  useEffect(() => {
    (async (): Promise<void> => {
      const { data } = await APIService.account.getAll();

      const filteredAccounts = data.accounts.filter((singleAccount) => singleAccount.is_selected || singleAccount.is_selected === null);
      setAccountsData(filteredAccounts);

      const accountsStatuses = Array.from(new Set(
        filteredAccounts.map((singleAccount) => singleAccount.categorization_status)
      ));

      if (accountsStatuses.length) {
        const maxStatus = Math.max(...accountsStatuses);

        if (maxStatus !== accountsStatusRef.current) {
          accountsStatusRef.current = maxStatus;
          setAccountsStatus(accountsStatusRef.current);
        }
      }
    })();
  }, [location]);

  useEffect(() => {
    if (accountsStatus !== undefined) {
      showNotification({ content: t(`account_status.${accountsStatus}`), type: accountsStatus !== 0 ? 'warning' : 'success' });
    }
  }, [accountsStatus, t]);

  return (
    <Switch>
      {
        theme.custom.menu?.includes('general-accounts') && (
          <Route
            component={ BankAccounts }
            exact
            path={ ROUTES.AUTHORIZED.BANK_ACCOUNTS }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-accounts') && (
          <Route
            component={ BankAccounts }
            exact
            path={ `${ROUTES.AUTHORIZED.BANK_ACCOUNTS}/connect/:id` }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-accounts') && (
          <Route
            component={ BankAccounts }
            exact
            path={ `${ROUTES.AUTHORIZED.BANK_ACCOUNTS}/update/:id` }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-affinities') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.AFFINITIES }
            render={ (): JSX.Element => (
              <Affinities withTree={ withTree } />
            ) }
          />

        )
      }
      {
        theme.custom.menu?.includes('general-attributes') && (
          <Route
            component={ Attributes }
            exact
            path={ ROUTES.AUTHORIZED.ATTRIBUTES }
          />

        )
      }
      {
        theme.custom.menu?.includes('general-connection') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.ADD_BANK_CONNECTION }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="general"
                infoText={ t('add_new_bank_connection.info.general') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-connection') && (
          <Route
            exact
            path={ `${ROUTES.AUTHORIZED.ADD_BANK_CONNECTION}/:bankId` }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="general"
                infoText={ t('add_new_bank_connection.info.general') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-contracts') && (
          <Route
            component={ GeneralContracts }
            exact
            path={ ROUTES.AUTHORIZED.CONTRACTS }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-expenses') && (
          <Route
            component={ General_Expenses }
            exact
            path={ ROUTES.AUTHORIZED.EXPENSES }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-income') && (
          <Route
            component={ General_Income }
            exact
            path={ ROUTES.AUTHORIZED.INCOME }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-overview') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.DASHBOARD }
            render={ (): JSX.Element => <GeneralOverview accounts={ accountsData } /> }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-profitloss') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.PROFIT_AND_LOSS }
            render={ (): JSX.Element => (<ProfitAndLoss consumerType="general" />) }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-transactions') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.TRANSACTIONS }
            render={ (): JSX.Element => (
              <GeneralTransactions
                withPrediction={ withPrediction }
                withTree={ withTree }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-vouchers') && (
          <Route
            component={ Vouchers }
            exact
            path={ ROUTES.AUTHORIZED.VOUCHERS }
          />
        )
      }
      {
        theme.custom.menu?.includes('general-category-tree') && (
          <Route
            component={CategoryTree}
            exact
            path={ROUTES.AUTHORIZED.CATEGORY_TREE}
          />
        )
      }
      {
        theme.custom.menu?.includes('general-profile') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.SETTINGS }
            render={ (): JSX.Element => <Settings /> }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-cashback') && (
          <Route
            component={ Cashbacks }
            exact
            path={ ROUTES.AUTHORIZED.CASH_BACKS }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-connection') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.ADD_BANK_CONNECTION }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="trader"
                infoText={ t('add_new_bank_connection.info.trader') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-connection') && (
          <Route
            exact
            path={ `${ROUTES.AUTHORIZED.ADD_BANK_CONNECTION}/:bankId` }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="trader"
                infoText={ t('add_new_bank_connection.info.trader') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-documents') && (
          <Route
            component={ Documents }
            exact
            path={ ROUTES.AUTHORIZED.DOCUMENTS }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-mgm') && (
          <Route
            component={ Code }
            exact
            path={ ROUTES.AUTHORIZED.CODE }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-overview') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.DASHBOARD }
            render={ (): JSX.Element => <TraderOverview accounts={ accountsData } /> }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-profile') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.SETTINGS }
            render={ (): JSX.Element => <Settings showCashback /> }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-reports') && (
          <Route
            component={ Reports }
            exact
            path={ ROUTES.AUTHORIZED.REPORTS }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-securities') && (
          <Route
            component={ Securities }
            exact
            path={ ROUTES.AUTHORIZED.SECURITIES }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-trades') && (
          <Route
            component={ Trades }
            exact
            path={ ROUTES.AUTHORIZED.TRADES }
          />
        )
      }
      {
        theme.custom.menu?.includes('trader-transactions') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.TRANSACTIONS }
            render={ (): JSX.Element => (
              <TraderTransactions
                withPrediction={ withPrediction }
                withTree={ withTree }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-connection') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.ADD_BANK_CONNECTION }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="sme"
                infoText={ t('add_new_bank_connection.info.sme') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-connection') && (
          <Route
            exact
            path={ `${ROUTES.AUTHORIZED.ADD_BANK_CONNECTION}/:bankId` }
            render={ (): JSX.Element => (
              <AddNewBankConnection
                consumerType="sme"
                infoText={ t('add_new_bank_connection.info.sme') }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-contracts') && (
          <Route
            component={ SMEContracts }
            exact
            path={ ROUTES.AUTHORIZED.CONTRACTS }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-expenses') && (
          <Route
            component={ SME_Expenses }
            exact
            path={ ROUTES.AUTHORIZED.EXPENSES }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-income') && (
          <Route
            component={ SME_Income }
            exact
            path={ ROUTES.AUTHORIZED.INCOME }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-invoices') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.INVOICES }
            render={ (): JSX.Element => (<Invoices />) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-invoices') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.INVOICES_CREATE }
            render={ (): JSX.Element => (<CreateInvoice />) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-invoices') && (
          <Route
            exact
            path={ `${ROUTES.AUTHORIZED.INVOICES}/:id` }
            render={ (): JSX.Element => (<EditInvoice />) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-overview') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.DASHBOARD }
            render={ (): JSX.Element => <SMEOverview accounts={ accountsData } /> }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-profitloss') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.PROFIT_AND_LOSS }
            render={ (): JSX.Element => (<ProfitAndLoss consumerType="sme" />) }
          />
        )
      }
      {
        theme.custom.menu?.includes('sme-transactions') && (
          <Route
            exact
            path={ ROUTES.AUTHORIZED.TRANSACTIONS }
            render={ (): JSX.Element => (
              <SMETransactions
                withPrediction={ withPrediction }
                withTree={ withTree }
              />
            ) }
          />
        )
      }
      {
        theme.custom.menu?.includes('pocket-flowerchart-test') && (
          <Route
            component={ TestFlower }
            exact
            path="/flower-chart-test"
          />
        )
      }
      {
        theme.custom.menu?.includes('regios-overview') && (
          <Route 
            component={ Regios }
            exact
            path={ ROUTES.AUTHORIZED.REGIOS }
          />
        )
      }
      {
        theme.custom.menu?.includes('pocket-transactions') && (
          <Route
            component={ PocketTransactions }
            exact
            path={ ROUTES.AUTHORIZED.TRANSACTIONS }
          />
        )
      }
      <Redirect to="/" />
    </Switch>
  );
};


export default AuthorizedRouter;
