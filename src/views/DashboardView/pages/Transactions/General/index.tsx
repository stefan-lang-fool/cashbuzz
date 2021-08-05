/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
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

interface Props {
  withPrediction?: boolean;
  withTree?: boolean;
}

const Transactions = ({ withPrediction, withTree }: Props): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [futureTransactionList, setFutureTransactionList] = useState<SingleTransaction[]>([]);
  const [futureTransactionListActivePage, setFutureTransactionListActivePage] = useState(1);
  const [futureTransactionListPagination, setFutureTransactionListPagination] = useState<Pagination>();
  const [isLoading, setIsLoading] = useState(true);
  const [pastTransactionList, setPastTransactionList] = useState<SingleTransaction[]>([]);
  const [pastTransactionListActivePage, setPastTransactionListActivePage] = useState(1);
  const [pastTransactionListPagination, setPastTransactionListPagination] = useState<Pagination>();

  const accountDataHelper = useRef<{[key: string]: Account}>({});
  const initRef = useRef(true);
  const loadingIdRef = useRef<null | number>(null);
  const organizationsHelper = useRef<{ [key: string]: Organization }>({});

  const fetchFutureTransactions = useCallback(async (page: number, offLoading = false): Promise<void> => {
    setIsLoading(true);
    const resultData: SingleTransaction[] = [];
    const { data } = await APIService.transaction.getFutureTransactions(page);

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

    setFutureTransactionList(resultData);
    setFutureTransactionListPagination(data.paging);

    if (offLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses]);

  const fetchPastTransactions = useCallback(async (page: number, offLoading = false): Promise<void> => {
    setIsLoading(true);
    const resultData: SingleTransaction[] = [];
    const { data } = await APIService.transaction.getAll(page);

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

    setPastTransactionList(resultData);
    setPastTransactionListPagination(data.paging);

    if (offLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses]);

  useEffect(() => {
    const fetchAll = async (): Promise<void> => {
      setIsLoading(true);

      try {
        await fetchPastTransactions(1);

        if (withPrediction) {
          await fetchFutureTransactions(1);
        }

        initRef.current = false;
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [fetchFutureTransactions, fetchPastTransactions, t, withPrediction]);

  useEffect(() => {
    if (!initRef.current) {
      fetchPastTransactions(pastTransactionListActivePage, true);
    }
  }, [fetchPastTransactions, pastTransactionListActivePage]);

  useEffect(() => {
    if (!initRef.current && withPrediction) {
      fetchFutureTransactions(futureTransactionListActivePage, true);
    }
  }, [fetchFutureTransactions, futureTransactionListActivePage, withPrediction]);

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
      <div className={ classes.section }>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('transactions.past_transactions_table.title') }
        </Typography>
        <div className={ classes.sectionContent }>
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
                  <TableCell>
                    { t('transaction.detected_counterparty_name') }
                  </TableCell>
                  {
                    !isMobile && (
                      <TableCell>
                        { t('transaction.category') }
                      </TableCell>
                    )
                  }
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
                empty={ !pastTransactionList.length }
                hasPagination={ !!pastTransactionListPagination?.pageCount }
                loading={ isLoading }
              >
                {
                  pastTransactionList.map((transaction) => (
                    <Row
                      key={ transaction.transaction.id }
                      account={ transaction.account }
                      isMobile={ isMobile }
                      organization={ transaction.organization }
                      qaction={ transaction.qaction }
                      qsubject={ transaction.qsubject }
                      transaction={ transaction.transaction }
                      type="past"
                    />
                  ))
                }
              </CustomTableBody>
            </Table>
            {
              pastTransactionListPagination && pastTransactionListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ pastTransactionListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setPastTransactionListActivePage(page); } }
              />
            )
            }
          </TableContainer>
        </div>
      </div>
      {
        withPrediction && (
          <div className={ classes.section }>
            <Typography
              className={ classes.sectionTitle }
              variant="h4"
            >
              { t('transactions.future_transactions_table.title') }
            </Typography>
            <div className={ classes.sectionContent }>
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
                      <TableCell>
                        { t('transaction.detected_counterparty_name') }
                      </TableCell>
                      {
                        !isMobile && (
                          <TableCell>
                            { t('transaction.category') }
                          </TableCell>
                        )
                      }
                      <TableCell
                        align="right"
                        style={ { width: 150 } }
                      >
                        { t('common.amount') }
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <CustomTableBody
                    customEmptyText={ t('transactions.future_transactions_table.no_data') }
                    empty={ !futureTransactionList.length }
                    hasPagination={ !!futureTransactionListPagination?.pageCount }
                    loading={ isLoading }
                  >
                    {
                      futureTransactionList.map((transaction) => (
                        <Row
                          key={ transaction.transaction.id }
                          account={ transaction.account }
                          isMobile={ isMobile }
                          organization={ transaction.organization }
                          qaction={ transaction.qaction }
                          qsubject={ transaction.qsubject }
                          transaction={ transaction.transaction }
                          type="future"
                        />
                      ))
                    }
                  </CustomTableBody>
                </Table>
                {
                  futureTransactionListPagination && futureTransactionListPagination.pageCount > 1
              && (
                <PaginationEl
                  color="primary"
                  count={ futureTransactionListPagination?.pageCount || 0 }
                  onChange={ (event, page): void => { setFutureTransactionListActivePage(page); } }
                />
              )
                }
              </TableContainer>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Transactions;
