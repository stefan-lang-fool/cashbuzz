import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from './components/Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import CustomTableBody from '@/components/Table/Body';
import { Pagination, Security } from '@/interfaces';
import APIService from '@/services/APIService';

const Securities = (): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [securitiesList, setSecuritiesList] = useState<Security[]>([]);
  const [securitiesListPagination, setSecuritiesListPagination] = useState<Pagination>();

  const loadingIdRef = useRef<null | number>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      const { data } = await APIService.securities.getAll(activePage);

      setSecuritiesListPagination(data.paging);
      setSecuritiesList(data.securities);
      setIsLoading(false);
    })();
  }, [activePage]);

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
                <TableCell>{ t('security.isin') }</TableCell>
                <TableCell>{ t('security.name') }</TableCell>
                <TableCell
                  align="right"
                  style={ { width: 150 } }
                >
                  { t('security.amount') }

                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('securities.table.no_data') }
              empty={ !securitiesList.length }
              hasPagination={ !!securitiesListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                securitiesList.map((security) => (
                  <Row
                    key={ security.id }
                    security={ security }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            securitiesListPagination && securitiesListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ securitiesListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
    </div>
  );
};

export default Securities;
