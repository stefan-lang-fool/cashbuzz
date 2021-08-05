/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Row, { SingleTransaction } from './components/Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION } from '@/constants';
import { Account, Pagination, Organization } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { useMobile } from '@/utils/hooks';

const Trades = (): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionList, setTransactionList] = useState<SingleTransaction[]>([]);
  const [transactionListPagination, setTransactionListPagination] = useState<Pagination>();

  const accountDataHelper = useRef<{[key: string]: Account}>({});
  const loadingIdRef = useRef<null | number>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  const fetchTransactions = useCallback(async (page: number): Promise<void> => {
    const resultData: SingleTransaction[] = [];
    const { data } = await APIService.transaction.getTrades(page);

    const missingOrgs: string[] = Array.from(new Set(data.transactions.map((singleTransaction) => singleTransaction.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
    if (missingOrgs.length) {
      const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

      missingOrgsData.forEach((singleOrganization) => {
        organizationsHelper.current[singleOrganization.id] = singleOrganization;
      });
    }

    for (const transaction of data.transactions) {
      let tempAccount = accountDataHelper.current[transaction.accountId];

      if (!tempAccount && transaction.accountId !== null) {
        const { data: accountData } = await APIService.account.get(transaction.accountId);
        accountDataHelper.current[transaction.accountId] = accountData;
        tempAccount = accountData;
      }

      const tempOrganization = transaction.org_id ? organizationsHelper.current[transaction.org_id] : undefined;
      let organization = transaction.org_id ? organizationsHelper.current[transaction.org_id]?.name : undefined;

      if (tempOrganization?.generic && transaction.counterpartName) {
        organization = transaction.counterpartName;
      }

      const descriptionAction = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(transaction.qaction || '') ? cashbuzzQClasses.find((qclass) => qclass.label === transaction.qaction) : undefined;
      const descriptionSubject = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(transaction.qsubject || '') ? cashbuzzQClasses.find((qclass) => qclass.label === transaction.qsubject) : undefined;

      resultData.push({
        account: tempAccount || undefined,
        organization,
        qaction: descriptionAction,
        qsubject: descriptionSubject,
        transaction
      });
    }

    setTransactionList(resultData);
    setTransactionListPagination(data.paging);
  }, [cashbuzzQClasses]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        await fetchTransactions(activePage);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activePage, fetchTransactions, t]);

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
        <TableContainer
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={ { width: 63 } } />
                {
                  !isMobile && (
                    <TableCell>
                      { t('transaction.account_name') }
                    </TableCell>
                  )
                }
                <TableCell>
                  { t('transaction.value_date') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell>
                      { t('transaction.detected_counterparty_name') }
                    </TableCell>
                  )
                }
                {
                  !isMobile && (
                    <TableCell>
                      { t('transaction.category') }
                    </TableCell>
                  )
                }
                <TableCell>
                  { t('transaction.isin_wkn') }
                </TableCell>
                <TableCell
                  align="right"
                  style={ { width: 150 } }
                >
                  { t('common.amount') }
                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('transactions.past_transactions_table.no_data') }
              empty={ !transactionList.length }
              hasPagination={ !!transactionListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                transactionList.map((transaction) => (
                  <Row
                    key={ transaction.transaction.id }
                    account={ transaction.account }
                    isMobile={ isMobile }
                    organization={ transaction.organization }
                    qaction={ transaction.qaction }
                    qsubject={ transaction.qsubject }
                    transaction={ transaction.transaction }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            transactionListPagination && transactionListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ transactionListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
    </div>
  );
};

export default Trades;
