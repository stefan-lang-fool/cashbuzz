/* eslint-disable max-len */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import DetailsView from './components/DetailsView';
import { SingleTransaction } from './components/Row';
import TransactionListView from './components/TransactionListView';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import { CATEGORIZATION } from '@/constants';
import { Account, Invoice, Organization } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';

type ViewType = 'details' | 'transaction-list';

const EditInvoice = (): JSX.Element => {
  const classes = styles();
  const params = useParams<{id?: string}>();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [activeView, setActiveView] = useState<ViewType>('details');
  const [addressData, setAddressData] = useState<{ street?: string; codeAndCity?: string; country?: string }>();
  const [invoice, setInvoice] = useState<Invoice>();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization>();
  const [selectedTransaction, setSelectedTransaction] = useState<SingleTransaction>();

  const accountDataHelper = useRef<{[key: string]: Account}>({});
  const loadingIdRef = useRef<null|number>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  const fetchData = useCallback(async (withLoading = true) => {
    if (params.id) {
      try {
        if (withLoading) {
          setIsLoading(true);
        }

        const { data: invoiceData } = await APIService.invoices.get(params.id);
        const { data: orgData } = await APIService.description.getOrganization(invoiceData.org_id);

        let parsedAddress;
        if (invoiceData.custom_address) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parsedAddress = JSON.parse(invoiceData.custom_address as any).address;
        } else if (orgData) {
          parsedAddress = orgData.address.address;
        }

        if (parsedAddress) {
          const splittedAddress = parsedAddress.split(', ');

          setAddressData({
            codeAndCity: splittedAddress[1] || undefined,
            country: splittedAddress[2] || undefined,
            street: splittedAddress[0] || undefined
          });
        }

        if (invoiceData.payment_transaction) {
          const { data: selectedTransactionData } = await APIService.transaction.get(invoiceData.payment_transaction);

          let organizationData = selectedTransactionData.org_id ? organizationsHelper.current[selectedTransactionData.org_id] : undefined;
          if (!organizationData && selectedTransactionData.org_id) {
            const { data: orgTransactionData } = await APIService.description.getOrganization(selectedTransactionData.org_id);
            organizationsHelper.current[selectedTransactionData.org_id] = orgTransactionData;
            organizationData = orgTransactionData;
          }

          let tempAccount = accountDataHelper.current[selectedTransactionData.accountId];
          if (!tempAccount) {
            const { data: accountData } = await APIService.account.get(selectedTransactionData.accountId);
            accountDataHelper.current[selectedTransactionData.accountId] = accountData;
            tempAccount = accountData;
          }

          const descriptionAction = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(selectedTransactionData.qaction || '') ? cashbuzzQClasses.find((qclass) => qclass.label === selectedTransactionData.qaction) : undefined;
          const descriptionSubject = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(selectedTransactionData.qaction || '') ? cashbuzzQClasses.find((qclass) => qclass.label === selectedTransactionData.qsubject) : undefined;

          setSelectedTransaction({
            account: tempAccount || undefined,
            organization: organizationData?.generic && selectedTransactionData.counterpartName ? selectedTransactionData.counterpartName : organizationData?.name,
            qaction: descriptionAction,
            qsubject: descriptionSubject,
            transaction: selectedTransactionData
          });
        } else {
          setSelectedTransaction(undefined);
        }

        setOrganization(orgData);
        setInvoice(invoiceData);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses, params.id, t]);

  const onRemoveTransactionHandler = useCallback(async (): Promise<void> => {
    if (!invoice) {
      return;
    }

    try {
      setIsLoading(true);
      await APIService.invoices.edit(invoice.id, {
        ...invoice,
        payment_date: null,
        payment_transaction: null
      });
      await fetchData(false);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, invoice, t]);

  const view = useMemo(() => {
    if (!invoice) {
      return <div className={ `${classes.root} dashboard-view-element-root` } />;
    }

    switch (activeView) {
      case 'transaction-list':
        return (
          <TransactionListView
            invoice={ invoice }
            onBack={ (): void => { setActiveView('details'); } }
            onUpdate={ async (): Promise<void> => {
              await fetchData();
              setActiveView('details');
            } }
          />
        );

      case 'details':
      default:
        return (
          <DetailsView
            addressData={ addressData }
            invoice={ invoice }
            onRemove={ onRemoveTransactionHandler }
            onUpdate={ async (): Promise<void> => {
              await fetchData(false);
            } }
            openTransactionListView={ (): void => { setActiveView('transaction-list'); } }
            organization={ organization }
            selectedTransaction={ selectedTransaction }
          />
        );
    }
  }, [activeView, addressData, classes.root, invoice, fetchData, onRemoveTransactionHandler, organization, selectedTransaction]);

  useEffect(() => {
    (async (): Promise<void> => {
      await fetchData();
    })();
  }, [fetchData]);

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
      { view }
    </div>
  );
};

export default EditInvoice;
