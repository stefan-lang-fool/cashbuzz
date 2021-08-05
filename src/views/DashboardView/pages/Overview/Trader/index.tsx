import {
  Divider,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import CustomTableBody from '@/components/Table/Body';
import { Account, GetDataResponseData, Pagination, Suggestion } from '@/interfaces';
import APIService from '@/services/APIService';
import { to6391Format } from '@/utils/languages';
import Hints from '@/views/DashboardView/components/Hints';
import StatusBar from '@/views/DashboardView/components/StatusBar';

interface Props {
  accounts: Account[];
}

const Dashboard = ({ accounts }: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const [dashboardData, setDashboardData] = useState<GetDataResponseData>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentHints, setCurrentHints] = useState<Suggestion[]>([]);
  const [hintsPagination, setHintsPagination] = useState<Pagination>();
  const [hintsActivePage, setHintsActivePage] = useState(1);
  const [statusBarSuggestions, setStatusBarSuggestions] = useState<Suggestion[]>([]);

  const loadingIdRef = useRef<null|number>(null);

  const fetchSuggestions = useCallback(async (page: number, standalone = true): Promise<void> => {
    if (standalone) {
      setIsLoading(true);
    }
    try {
      const { data } = await APIService.suggestions.getAll(page);

      setStatusBarSuggestions(data.hints.filter((singleHint) => singleHint.hint_location === 'status_bar'));
      setHintsPagination(data.paging);
      setCurrentHints(data.hints.filter((singleHint) => singleHint.hint_location === 'hint_box'));
    } catch (error) {
      if (standalone) {
        // showNotification({ content: t('common.internal_error'), type: 'error' });
      } else {
        throw error;
      }
    } finally {
      if (standalone) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAll = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const { data } = await APIService.data.get();
        await fetchSuggestions(1, false);

        setDashboardData(data);
      } catch {
        // showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [fetchSuggestions, t]);

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
        <StatusBar
          accounts={ accounts }
          messages={ statusBarSuggestions }
          showDevider={ !!dashboardData?.onemarkets_top.length }
          traderData={ dashboardData }
          type="TRADER"
        />
        {
          !!accounts.length && (
            <TableContainer
              className="top-hvb"
              component={ Paper }
              style={ { overflowY: 'hidden' } }
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      { t('overview.trader.table.columns.wkn') }
                    </TableCell>
                    <TableCell>
                      { t('overview.trader.table.columns.trades') }
                    </TableCell>
                    <TableCell align="right">
                      { t('overview.trader.table.columns.total_order_volume') }
                    </TableCell>
                  </TableRow>
                </TableHead>
                <CustomTableBody
                  customEmptyText={ t('overview.trader.table.no_data') }
                  empty={ !dashboardData?.onemarkets_top.length }
                  loading={ isLoading }
                >
                  {
                dashboardData?.onemarkets_top.map((transaction) => (
                  <TableRow key={ transaction.wkn }>
                    <TableCell>{ transaction.wkn }</TableCell>
                    <TableCell>{ transaction.count }</TableCell>
                    <TableCell align="right">{ new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(transaction.abs_amount) }</TableCell>
                  </TableRow>
                ))
                  }
                </CustomTableBody>
              </Table>
            </TableContainer>
          )
        }
        { currentHints.length > 0 && (
          <>
            <Divider style={ { marginTop: '40px', marginBottom: '40px' } } />
            <Hints
              activePage={ hintsActivePage }
              hints={ currentHints }
              isLoading={ isLoading }
              onPageChange={ (page): void => { setHintsActivePage(page); } }
              pagination={ hintsPagination }
            />
          </>
        ) }
      </div>
    </div>
  );
};

export default Dashboard;
