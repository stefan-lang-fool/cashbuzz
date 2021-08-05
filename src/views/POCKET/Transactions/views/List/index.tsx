/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  CircularProgress,
  List,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import { format, parse, isSameDay, isToday, isYesterday } from 'date-fns';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAsyncEffect } from 'use-async-effect';

import ListItem, { SingleTransaction } from './components/Item';
import styles from './styles';
import { showNotification } from '@/components/Notification';
import { Pagination, Organization, Transaction } from '@/interfaces';
import APIService from '@/services/APIService';
import { PropsWithClassName } from '@/types';
import { getCurrentDateFormat } from '@/utils/format';

interface SingleGroup {
  date: Date;
  label: string;
  transactions: SingleTransaction[];
}

interface Props {
  hidden?: boolean;
  onSelect?: (transaction: Transaction, org?: string) => void | Promise<void>;
}

const TransactionsListView = ({ className, hidden, onSelect }: PropsWithClassName<Props>): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>();
  const [transactions, setTransactions] = useState<SingleTransaction[]>([]);

  const organizationsHelper = useRef<{ [key: string]: Organization }>({});
  const transactionsRef = useRef(transactions);

  const currentDateFormat = useMemo(() => getCurrentDateFormat(), []);

  const groupedTransactions = useMemo(() => transactions.reduce<SingleGroup[]>((previous, current) => {
    const currentDate = parse(current.transaction.valueDate, 'yyyy-MM-dd', new Date());

    let el = previous.find((singleEl) => isSameDay(singleEl.date, currentDate));
    if (!el) {
      let label = '';
      if (isToday(currentDate)) {
        label = t('time.today');
      } else if (isYesterday(currentDate)) {
        label = t('time.yesterday');
      } else {
        label = format(currentDate, currentDateFormat);
      }
      el = {
        date: currentDate,
        label,
        transactions: []
      };
      previous.push(el);
    }

    el.transactions.push(current);

    return previous;
  }, []), [currentDateFormat, t, transactions]);

  useAsyncEffect(async () => {
    try {
      const resultData: SingleTransaction[] = [];
      const { data } = await APIService.transaction.getAll(currentPage, 15);

      const missingOrgs: string[] = Array.from(new Set(data.transactions.map((singleTransaction) => singleTransaction.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
      if (missingOrgs.length) {
        const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

        missingOrgsData.forEach((singleOrganization) => {
          organizationsHelper.current[singleOrganization.id] = singleOrganization;
        });
      }

      for (const transaction of data.transactions) {
        const tempOrganization = transaction.org_id ? organizationsHelper.current[transaction.org_id] : undefined;
        let organization = transaction.org_id ? organizationsHelper.current[transaction.org_id]?.name : undefined;

        if (tempOrganization?.generic && transaction.counterpartName) {
          organization = transaction.counterpartName;
        }

        resultData.push({
          organization,
          transaction
        });
      }

      transactionsRef.current = [...transactionsRef.current, ...resultData];
      setTransactions(transactionsRef.current);
      setPagination(data.paging);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }
  }, [currentPage]);

  return (
    <div className={ classNames([classes.root, className]) }>
      <InfiniteScroll
        dataLength={ transactions.length }
        hasMore={ !hidden && (pagination?.pageCount || 1) > currentPage }
        loader={ <div className={ classes.loader }><CircularProgress /></div> }
        next={ (): void => { setCurrentPage(currentPage + 1); } }
        scrollableTarget="main-content"
        scrollThreshold="100px"
      >
        {
          groupedTransactions.map((singleGroup) => (
            <div
              key={ singleGroup.date.getTime() }
              className={ classes.transactionGroup }
            >
              <Typography className={ classes.transactionGroupTitle }>
                { singleGroup.label }
              </Typography>
              <List className={ classes.transactionGroupList }>
                { singleGroup.transactions.map((singleTransaction) => (
                  <ListItem
                    key={ singleTransaction.transaction.id }
                    onSelect={ onSelect }
                    organization={ singleTransaction.organization }
                    transaction={ singleTransaction.transaction }
                  />
                )) }
              </List>
            </div>
          ))
        }
      </InfiniteScroll>
    </div>
  );
};

export default TransactionsListView;
