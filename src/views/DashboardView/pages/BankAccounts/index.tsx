/* eslint-disable max-len */
/* eslint-disable no-fallthrough */
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router';

import Row from './components/Row';
import styles from './styles';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { ROUTES } from '@/constants';
import { Account, Bank, BankInterface } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { BankInterfaceOptionType } from '@/types';
import { useMobile } from '@/utils/hooks';
import BankConnectionForm from '@/views/DashboardView/pages/AddNewBankConnection/components/BankConnectionForm';

export interface BankAccount {
  account: Account;
  bank?: Bank;
  showSecurityOption?: boolean;
}

type ModeType = 'connect' | 'update' | undefined;

const BankAccounts = (): JSX.Element => {
  const classes = styles();
  const location = useLocation();
  const isMobile = useMobile();
  const params = useParams<{id: string}>();
  const { t } = useTranslation();

  const shouldEnforceAccountSelection = useSelector((appState: AppState) => appState.cashbuzz.enforceAccountSelection);

  const [bankAccountList, setBankAccountList] = useState<BankAccount[]>([]);
  const [deleteBankAccountDialogOpened, setDeleteBankAccountDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>();
  const [selectedAccountToUpdate, setSelectedAccountToUpdate] = useState<Account>();

  const accountsVisibilityHaxBeenModifiedRef = useRef(false);
  const bankAccountListRef = useRef(bankAccountList);
  const loadingIdRef = useRef<null|number>(null);

  const addSecurities = async (data: BankAccount): Promise<void> => {
    window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.BANK_ACCOUNTS}/connect/${data.account.id}`;
  };

  const fetchAccountToUpdateData = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await APIService.account.get(Number.parseInt(params.id, 10));
      setSelectedAccountToUpdate(data);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, t]);

  const hasSecurityInterface = useCallback((usedInterfaces: BankInterfaceOptionType[], bankInterfaces: BankInterfaceOptionType[]): boolean => !!usedInterfaces
    .filter((tempInterface) => !bankInterfaces.includes(tempInterface))
    .concat(bankInterfaces.filter((tempInterface) => !usedInterfaces.includes(tempInterface)))
    .filter((tempInterface) => tempInterface === 'FINTS_SERVER' || tempInterface === 'WEB_SCRAPER')
    .length, []);

  const fetchBankAccounts = useCallback(async (): Promise<void> => {
    const resultData: BankAccount[] = [];

    const { data } = await APIService.account.getAll();

    await Promise.all(data.accounts.map(async (account): Promise<void> => {
      try {
        const { data: bankConnectionData } = await APIService.bankConnections.get(account.bankConnectionId);

        let hasSecurity = false;
        const usedInterfaces = new Set<BankInterfaceOptionType>();

        bankConnectionData.accountIds.forEach((accountId) => {
          const accountData = data.accounts.find((tempAccount) => tempAccount.id === accountId);

          if (accountData) {
            accountData.interfaces.forEach((acountInterface) => {
              usedInterfaces.add(acountInterface.interface);
            });

            if (accountData.accountTypeId === 4) {
              hasSecurity = true;
            }
          }
        });

        resultData.push({
          account,
          bank: bankConnectionData.bank,
          showSecurityOption: account.accountTypeId !== 4
          && !hasSecurity
          && hasSecurityInterface(Array.from(usedInterfaces), bankConnectionData.bank.interfaces.map((bankInterface) => bankInterface.interface))
        });
      } catch {
        resultData.push({
          account,
          bank: undefined,
          showSecurityOption: false
        });
      }
    }));

    setBankAccountList(resultData);
    bankAccountListRef.current = resultData;
    setIsLoading(false);
  }, [hasSecurityInterface]);

  const changeAccountVisibility = useCallback(async (id: string, status: boolean): Promise<void> => {
    setIsLoading(true);

    try {
      await APIService.account.updateIsSelected(id, status);
      await fetchBankAccounts();

      if (!accountsVisibilityHaxBeenModifiedRef.current) {
        accountsVisibilityHaxBeenModifiedRef.current = true;
      }
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }

    setIsLoading(false);
  }, [fetchBankAccounts, t]);

  const deleteBankAccount = useCallback(async (): Promise<void> => {
    if (!selectedAccount) {
      return;
    }

    try {
      await APIService.account.delete(selectedAccount.account.id);
      await fetchBankAccounts();

      setDeleteBankAccountDialogOpened(false);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }
  }, [fetchBankAccounts, selectedAccount, t]);

  const activeMode = useMemo((): ModeType => {
    if (params.id) {
      const splittedLocation = location.pathname.split('/');
      return (splittedLocation[splittedLocation.length - 2] as ModeType);
    }

    return undefined;
  }, [params.id, location.pathname]);

  const resyncBankAccount = useCallback(async (data: BankAccount): Promise<void> => {
    window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.BANK_ACCOUNTS}/update/${data.account.id}`;
  }, []);

  const selectInterfaceForConnect = useCallback((interfaces: BankInterface[]): BankInterfaceOptionType => {
    const mappedInterfaces = interfaces.map((tempInterface) => tempInterface.interface);

    if (!mappedInterfaces.includes('FINTS_SERVER')) {
      return 'FINTS_SERVER';
    }

    if (!mappedInterfaces.includes('WEB_SCRAPER')) {
      return 'WEB_SCRAPER';
    }

    return 'XS2A';
  }, []);

  const selectInterfaceForResync = useCallback((interfaces: BankInterface[]): BankInterfaceOptionType => {
    const mappedInterfaces = interfaces.map((tempInterface) => tempInterface.interface);
    if (mappedInterfaces.includes('FINTS_SERVER')) {
      return 'FINTS_SERVER';
    }

    if (mappedInterfaces.includes('WEB_SCRAPER')) {
      return 'WEB_SCRAPER';
    }

    return 'XS2A';
  }, []);

  const activeElement = useMemo(() => {
    switch (activeMode) {
      case 'connect':
        if (selectedAccountToUpdate) {
          return (
            <BankConnectionForm
              bankId={ selectedAccountToUpdate.bankConnectionId }
              bankInterface={ selectInterfaceForConnect(selectedAccountToUpdate.interfaces) }
              connect
              onComplete={ (): void => {
                window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.BANK_ACCOUNTS}`;
              } }
            />
          );
        }
      case 'update':
        if (selectedAccountToUpdate) {
          return (
            <BankConnectionForm
              bankId={ selectedAccountToUpdate.bankConnectionId }
              bankInterface={ selectInterfaceForResync(selectedAccountToUpdate.interfaces) }
              onComplete={ (): void => {
                window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.BANK_ACCOUNTS}`;
              } }
              update
            />
          );
        }
      default:
        return (
          <TableContainer
            component={ Paper }
            style={ { overflowY: 'hidden' } }
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={ { width: 63 } } />
                  {
                    !isMobile && <TableCell>{ t('bank_accounts.table.columns.bank_name') }</TableCell>
                  }
                  {
                    !isMobile && <TableCell>{ t('bank_accounts.table.columns.account_name') }</TableCell>
                  }
                  {
                    isMobile && (
                      <TableCell>{ `${t('bank_accounts.table.columns.bank_name')} & ${t('bank_accounts.table.columns.account_name')}` }</TableCell>
                    )
                  }
                  {
                    shouldEnforceAccountSelection && !isMobile && (
                      <TableCell>{ t('bank_accounts.table.columns.visibility') }</TableCell>
                    )
                  }
                  <TableCell style={ { width: isMobile ? undefined : 200 } }>
                    { t('bank_accounts.table.columns.status') }
                  </TableCell>
                  <TableCell style={ { width: isMobile ? undefined : 350 } }>
                    { t('bank_accounts.table.columns.actions') }
                  </TableCell>
                </TableRow>
              </TableHead>
              <CustomTableBody
                customEmptyText={ t('bank_accounts.table.no_data') }
                empty={ !bankAccountList.length }
              >
                {
                  bankAccountList
                    .sort((a, b) => {
                      const sortStatusArray = [null, true, false];
                      const sortStatusResult = sortStatusArray.indexOf(a.account.is_selected) - sortStatusArray.indexOf(b.account.is_selected);

                      const A_bankName = a.bank?.name || '';
                      const B_bankName = b.bank?.name || '';

                      const A_accountName = a.account.accountName || '';
                      const B_accountName = b.account.accountName || '';

                      return sortStatusResult || A_bankName.localeCompare(B_bankName) || A_accountName.localeCompare(B_accountName) || a.account.id - b.account.id;
                    })
                    .map((bankAccount) => (
                      <Row
                        key={ bankAccount.account.id }
                        addSecurities={ addSecurities }
                        data={ bankAccount }
                        isMobile={ isMobile }
                        onVisibilityChanged={ (status: boolean): void => {
                          changeAccountVisibility(bankAccount.account.cb_id, status);
                        } }
                        removeActionClicked={ (data): void => {
                          setSelectedAccount(data);
                          setDeleteBankAccountDialogOpened(true);
                        } }
                        resyncActionClicked={ resyncBankAccount }
                        shouldEnforceAccountSelection={ shouldEnforceAccountSelection }
                      />
                    ))
                }
              </CustomTableBody>
            </Table>
          </TableContainer>
        );
    }
  }, [
    activeMode,
    bankAccountList,
    changeAccountVisibility,
    isMobile,
    resyncBankAccount,
    selectedAccountToUpdate,
    selectInterfaceForConnect,
    selectInterfaceForResync,
    shouldEnforceAccountSelection,
    t
  ]);

  useEffect(() => {
    if (!params.id) {
      fetchBankAccounts();
    } else {
      fetchAccountToUpdateData();
    }

    return (): void => {
      if (!shouldEnforceAccountSelection) {
        return;
      }

      if (bankAccountListRef.current.find((singleAccount) => singleAccount.account.is_selected === null)) {
        showNotification({ content: t('bank_accounts.missing_visibility'), type: 'error' });
      }

      if (accountsVisibilityHaxBeenModifiedRef.current) {
        APIService.categorization.recalculateSubscriptions();
      }
    };
  }, [fetchAccountToUpdateData, fetchBankAccounts, params.id, shouldEnforceAccountSelection, t]);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (loadingIdRef.current) {
      closeLoading(loadingIdRef.current);
    }
  }, []);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ `${classes.root}-content` }>
        { activeElement }
        <ConfirmationDialog
          isOpened={ deleteBankAccountDialogOpened }
          onCancel={ (): void => { setDeleteBankAccountDialogOpened(false); } }
          onOk={ deleteBankAccount }
          question={ t('bank_accounts.delete_bank_account_question') }
          title={ t('bank_accounts.delete_bank_account') }
        />
      </div>
    </div>
  );
};

export default BankAccounts;
