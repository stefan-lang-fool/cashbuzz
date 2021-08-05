/* eslint-disable no-case-declarations */
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
import AcceptCashbuzzPolicyDialog from './dialogs/acceptCashbuzzTOSPP';
import UpdatePartnerDialog from './dialogs/updatePartner';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { HTTP_CODES } from '@/constants';
import { Cashback, Pagination, Partner } from '@/interfaces';
import APIService from '@/services/APIService';
import { useMobile } from '@/utils/hooks';

const Cashbacks = (): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [cashbackList, setCashbackList] = useState<Cashback[]>([]);
  const [cashbackListPagination, setCashbackListPagination] = useState<Pagination>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCashback, setSelectedCashback] = useState<Cashback>();
  const [selectedPartner, setSelectedPartner] = useState<Partner>();
  const [accectCashbuzzPolicyDialogOpened, setAcceptCashbuzzPolicyDialogOpened] = useState(false);
  const [updatePartnerDialogOpened, setUpdatePartnerDialogOpened] = useState(false);

  const loadingIdRef = useRef<null|number>(null);

  const fetchCashbacks = useCallback(async (page: number, enableLoading = true): Promise<void> => {
    if (enableLoading) {
      setIsLoading(true);
    }
    const { data } = await APIService.cashbacks.getAll(page);

    setCashbackListPagination(data.paging);
    setCashbackList(data.cashbacks);
    setIsLoading(false);
  }, []);

  const redeemCashback = useCallback(async (cashbackData: Cashback): Promise<void> => {
    setIsLoading(true);

    try {
      await APIService.cashbacks.initialize(cashbackData.id);
      await fetchCashbacks(activePage);
    } catch (error) {
      switch (error.response.status) {
        case HTTP_CODES.CASHBACKS.MISSING_CASHBUZZ_TOSPP:
          setSelectedCashback(cashbackData);
          setAcceptCashbuzzPolicyDialogOpened(true);
          break;

        case HTTP_CODES.CASHBACKS.MISSING_KYC_LIGHT:
          showNotification({ content: t('cashbacks.missing_kyc_light'), type: 'error' });
          break;

        case HTTP_CODES.CASHBACKS.MISSING_TOSPP:
          const { data } = await APIService.partners.get(cashbackData.partnerId);

          setSelectedCashback(cashbackData);
          setSelectedPartner(data);
          setUpdatePartnerDialogOpened(true);
          break;

        case HTTP_CODES.CASHBACKS.CASHBACK_ALREADY_REDEEMED:
          window.location.reload();
          break;

        case HTTP_CODES.CASHBACKS.CASHBACKS_REQUIREMENTS:
          showNotification({ content: t('cashbacks.missing_requirements'), type: 'error' });
          break;

        case HTTP_CODES.CASHBACKS.MISSING_KYC_HARD:
        default:
          showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [activePage, fetchCashbacks, t]);

  useEffect(() => {
    fetchCashbacks(activePage);
  }, [activePage, fetchCashbacks]);

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

  useEffect(() => {
    if (!accectCashbuzzPolicyDialogOpened) {
      setSelectedPartner(undefined);
      setSelectedCashback(undefined);
    }
  }, [accectCashbuzzPolicyDialogOpened]);

  useEffect(() => {
    if (!updatePartnerDialogOpened) {
      setSelectedPartner(undefined);
      setSelectedCashback(undefined);
    }
  }, [updatePartnerDialogOpened]);

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
                <TableCell style={ { width: 52 } } />
                {
                  !isMobile && <TableCell>{ t('cashback.partner_name') }</TableCell>
                }
                <TableCell>{ t('cashback.value_date') }</TableCell>
                <TableCell
                  align="right"
                  style={ { width: 150 } }
                >
                  { t('cashback.reward') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell style={ { width: 150 } }>
                      { t('cashback.status') }
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
              customEmptyText={ t('cashbacks.table.no_data') }
              empty={ !cashbackList.length }
              hasPagination={ !!cashbackListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                cashbackList.map((cashback) => (
                  <Row
                    key={ cashback.id }
                    cashback={ cashback }
                    isMobile={ isMobile }
                    redeemActionClicked={ redeemCashback }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            cashbackListPagination && cashbackListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ cashbackListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
      <AcceptCashbuzzPolicyDialog
        isOpened={ accectCashbuzzPolicyDialogOpened }
        onClose={ (): void => { setAcceptCashbuzzPolicyDialogOpened(false); } }
        onSubmit={ (): void => {
          if (selectedCashback) {
            redeemCashback(selectedCashback);
          }
        } }
      />
      <UpdatePartnerDialog
        isOpened={ updatePartnerDialogOpened }
        onClose={ (): void => { setUpdatePartnerDialogOpened(false); } }
        onSubmit={ (): void => {
          if (selectedCashback) {
            redeemCashback(selectedCashback);
          }
        } }
        partner={ selectedPartner }
      />
    </div>
  );
};

export default Cashbacks;
