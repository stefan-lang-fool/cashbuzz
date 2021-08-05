/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import styles from './styles';
import Row, { SingleTransaction } from '../Row';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION } from '@/constants';
import { Account, Invoice, Organization, Pagination, Transaction } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { useMobile } from '@/utils/hooks';

interface Props {
  invoice: Invoice;
  onBack?: () => void;
  onUpdate?: (transaction: SingleTransaction) => void;
}

const TransactionListView = ({ invoice, onBack = (): void => {}, onUpdate = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [activePage, setActivePage] = useState(1);
  const [transactionList, setTransactionList] = useState<SingleTransaction[]>([]);
  const [transactionListPagination, setTransactionListPagination] = useState<Pagination>();
  const [isLoading, setIsLoading] = useState(true);

  const accountDataHelper = useRef<{[key: string]: Account}>({});
  const loadingIdRef = useRef<null|number>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        const resultData: SingleTransaction[] = [];
        const { data: transactionsData } = await APIService.transaction.getAllByPeriod(invoice.invoice_date, format(new Date(), 'yyyy-MM-dd'), activePage);

        const missingOrgs: string[] = Array.from(new Set(transactionsData.transactions.map((singleTransaction) => singleTransaction.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
        if (missingOrgs.length) {
          const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

          missingOrgsData.forEach((singleOrganization) => {
            organizationsHelper.current[singleOrganization.id] = singleOrganization;
          });
        }

        for (const transaction of transactionsData.transactions) {
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
        setTransactionListPagination(transactionsData.paging);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }

      setIsLoading(false);
    })();
  }, [activePage, cashbuzzQClasses, invoice, t]);

  const onSelectHandler = useCallback(async (transaction: Transaction): Promise<void> => {
    setIsLoading(true);

    try {
      await APIService.invoices.edit(invoice.id, {
        ...invoice,
        payment_date: transaction.valueDate,
        payment_transaction: transaction.cb_id
      });

      let organizationData = transaction.org_id ? organizationsHelper.current[transaction.org_id] : undefined;
      if (!organizationData && transaction.org_id) {
        const { data: orgData } = await APIService.description.getOrganization(transaction.org_id);
        organizationsHelper.current[transaction.org_id] = orgData;
        organizationData = orgData;
      }

      let tempAccount = accountDataHelper.current[transaction.accountId];
      if (!tempAccount) {
        const { data: accountData } = await APIService.account.get(transaction.accountId);
        accountDataHelper.current[transaction.accountId] = accountData;
        tempAccount = accountData;
      }

      const descriptionAction = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(transaction.qaction || '') ? cashbuzzQClasses.find((qclass) => qclass.label === transaction.qaction) : undefined;
      const descriptionSubject = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(transaction.qsubject || '') ? cashbuzzQClasses.find((qclass) => qclass.label === transaction.qsubject) : undefined;

      onUpdate({
        account: tempAccount || undefined,
        organization: organizationData?.generic && transaction.counterpartName ? transaction.counterpartName : organizationData?.name,
        qaction: descriptionAction,
        qsubject: descriptionSubject,
        transaction
      });
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses, invoice, onUpdate, t]);

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
    <div className={ classes.root }>
      <Typography
        className={ classes.sectionTitle }
        variant="h4"
      >
        { t('invoices.transaction_list.title') }
      </Typography>
      <p className={ classes.sectionRemark }>{ t('invoices.transaction_list.description') }</p>
      <TableContainer
        className={ classes.table }
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
              <TableCell style={ { width: 105 } }>
                { t('invoices.table.columns.actions') }
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
                  onSelect={ onSelectHandler }
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
      <Button
        color="secondary"
        onClick={ (): void => { onBack(); } }
        size="large"
        variant="contained"
      >
        { t('invoices.transaction_list.back_button') }
      </Button>
    </div>
  );
};

export default TransactionListView;
