import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import Row from './components/Row';
import styles from './styles';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { ROUTES } from '@/constants';
import { Invoice, Pagination } from '@/interfaces';
import APIService from '@/services/APIService';

const Invoices = (): JSX.Element => {
  const classes = styles();
  const history = useHistory();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [deleteInvoiceDialogOpened, setDeleteInvoiceDialogOpened] = useState(false);
  const [deletedInvoiceId, setDeletedInvoiceId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesPagination, setInvoicesPagination] = useState<Pagination>();

  const loadingIdRef = useRef<null|number>(null);

  const fetchInvoices = useCallback(async (page: number): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await APIService.invoices.getAll(page);

      setInvoices(data.invoices);
      setInvoicesPagination(data.paging);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const deleteInvoice = useCallback(async (): Promise<void> => {
    setDeleteInvoiceDialogOpened(false);
    if (deletedInvoiceId) {
      setIsLoading(true);
      try {
        await APIService.invoices.delete(deletedInvoiceId);
        await fetchInvoices(activePage);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  }, [activePage, deletedInvoiceId, fetchInvoices, t]);

  useEffect(() => {
    fetchInvoices(activePage);
  }, [activePage, fetchInvoices]);

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
      <div className={ `${classes.root}-table-section section` }>
        <TableContainer
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={ { width: 63 } } />
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.invoice_date') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.customer') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.invoice_number') }
                </TableCell>
                <TableCell
                  align="right"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.amount') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.due_date') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.paid_date') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('invoices.table.columns.booked') }
                </TableCell>
                <TableCell
                  align="left"
                  style={ { width: 400 } }
                >
                  { t('invoices.table.columns.actions') }
                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('invoices.table.no_data') }
              empty={ !invoices.length }
              hasPagination={ !!invoicesPagination?.pageCount }
              loading={ isLoading }
            >
              { invoices.map((rowInvoice) => (
                <Row
                  key={ rowInvoice.id }
                  invoice={ rowInvoice }
                  onDelete={ (): void => {
                    setDeletedInvoiceId(rowInvoice.id);
                    setDeleteInvoiceDialogOpened(true);
                  } }
                />
              )) }
            </CustomTableBody>
          </Table>
          { invoicesPagination && invoicesPagination.pageCount > 1 && (
            <PaginationEl
              color="primary"
              count={ invoicesPagination?.pageCount || 0 }
              onChange={ (event, page): void => { setActivePage(page); } }
              page={ activePage }
            />
          ) }
        </TableContainer>
        <Button
          color="primary"
          onClick={ (): void => {
            history.push(ROUTES.AUTHORIZED.INVOICES_CREATE);
          } }
          size="large"
          style={ { marginTop: 24 } }
          variant="contained"
        >
          { t('invoices.form.add_new_invoice') }
        </Button>
      </div>
      <ConfirmationDialog
        isOpened={ deleteInvoiceDialogOpened }
        onCancel={ (): void => { setDeleteInvoiceDialogOpened(false); } }
        onOk={ deleteInvoice }
        question={ t('invoices.delete_invoice_question') }
        title={ t('invoices.delete_invoice') }
      />
    </div>
  );
};

export default Invoices;
