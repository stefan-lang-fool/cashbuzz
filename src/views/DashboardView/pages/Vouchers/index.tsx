import {
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

import Row from './components/Row';
import RedeemVoucherDialog from './dialogs/RedeemVoucher';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { Pagination, Voucher } from '@/interfaces';
import APIService from '@/services/APIService';
import { useMobile } from '@/utils/hooks';

const Vouchers = (): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemVoucherDialogOpened, setRedeemVoucherDialogOpened] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);
  const [vouchersListPagination, setVoucherListPagination] = useState<Pagination>();

  const loadingIdRef = useRef<null | number>(null);

  const fetchVouchers = useCallback(async (page: number): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await APIService.voucher.getAll(page);
      setVoucherListPagination(data.paging);
      setVoucherList(data.vouchers);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const openVoucherDialog = useCallback(async (voucherData: Voucher): Promise<void> => {
    setSelectedVoucher(voucherData);
    setRedeemVoucherDialogOpened(true);
  }, []);

  const redeemVoucher = useCallback(async (): Promise<void> => {
    window.open(selectedVoucher?.uri, '_blank');
    setRedeemVoucherDialogOpened(false);
  }, [selectedVoucher]);

  useEffect(() => {
    fetchVouchers(activePage);
  }, [activePage, fetchVouchers]);

  useEffect(() => {
    if (!redeemVoucherDialogOpened) {
      setSelectedVoucher(undefined);
    }
  }, [redeemVoucherDialogOpened]);

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
                <TableCell style={ { width: 95 } } />
                <TableCell>{ t('voucher.title') }</TableCell>
                {
                  !isMobile && <TableCell>{ t('voucher.shop_name') }</TableCell>
                }
                {
                  !isMobile && (
                    <TableCell
                      align="right"
                      style={ { width: 150 } }
                    >
                      { t('voucher.discount_amount') }
                    </TableCell>
                  )
                }
                <TableCell
                  align="left"
                  style={ { width: 200 } }
                >
                  { t('common.actions') }
                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('vouchers.table.no_data') }
              empty={ !voucherList.length }
              hasPagination={ !!vouchersListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                voucherList.map((voucher) => (
                  <Row
                    key={ voucher.id }
                    isMobile={ isMobile }
                    redeemActionClicked={ openVoucherDialog }
                    voucher={ voucher }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            vouchersListPagination && vouchersListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ vouchersListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
      <RedeemVoucherDialog
        isOpened={ redeemVoucherDialogOpened }
        onClose={ (): void => { setRedeemVoucherDialogOpened(false); } }
        onSubmit={ (): void => { redeemVoucher(); } }
        voucher={ selectedVoucher }
      />
    </div>
  );
};

export default Vouchers;
