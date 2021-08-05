/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { useHistory } from 'react-router';

import styles from './styles';
import { ICONS } from '@/assets';
import { ROUTES } from '@/constants';
import de from '@/data/countries/de.json';
import en from '@/data/countries/en.json';
import { Invoice } from '@/interfaces';
import APIService from '@/services/APIService';
import { getText } from '@/utils/data';
import { formatDate } from '@/utils/format';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';

export type EditInvoiceFormData = {
  invoiceDate: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  name: string;
  customerNumber: string;
  streetAddress: string;
  country: string;
  codeAndCity: string;
  paidDate: string;
};

interface Props {
  invoice: Invoice;
  onDelete: () => void;
}

const Row = ({ invoice, onDelete }: Props): JSX.Element => {
  const classes = styles();
  const history = useHistory();
  const { t, i18n: i18nInstance } = useTranslation();

  const [addressData, setAddressData] = useState<{ street?: string; codeAndCity?: string; country?: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [customerName, setCustomerName] = useState<string>();

  const setAddressFields = useCallback((address: string): void => {
    const splitAddress = address.split(',');
    if (!splitAddress.length) {
      return;
    }

    const tempAddressData: { street?: string; codeAndCity?: string; country?: string } = {};

    const country = splitAddress.slice(-1).pop();
    if (country) {
      if (getCurrentLanguage() === 'en') {
        tempAddressData.country = country.trim();
      } else {
        const enId = en.find((value) => value.name === country.trim())?.id;

        if (enId) {
          const deName = de.find(({ id }) => id === enId)?.name;
          tempAddressData.country = deName;
        }
      }
    }

    const codeAndCity = splitAddress.slice(-2, -1).pop();
    if (codeAndCity) {
      tempAddressData.codeAndCity = codeAndCity.trim();
    }

    const streetAddress = splitAddress.slice(-3, -2).pop();
    if (streetAddress) {
      tempAddressData.street = streetAddress.trim();
    }

    setAddressData(tempAddressData);
  }, []);

  const fetchOrganization = useCallback(async (): Promise<void> => {
    const { data } = await APIService.description.getOrganization(invoice.org_id);

    if (!invoice.custom_address) {
      if (data && data.address && data.address.address) {
        setAddressFields(data.address.address);
      }
    }

    if (!invoice.custom_org_name) {
      setCustomerName(data.name);
    }
  }, [invoice, setAddressFields]);

  useEffect(() => {
    if (invoice.custom_address) {
      const parsedAddress = JSON.parse(invoice.custom_address as any);
      if (parsedAddress && parsedAddress.address) {
        setAddressFields(parsedAddress.address);
      }
    }

    if (!invoice.custom_org_name || !invoice.custom_address) {
      fetchOrganization();
    }
  }, [fetchOrganization, invoice, setAddressFields]);

  return (
    <>
      <TableRow
        key={ invoice.id }
        className={ `${classes.root} ${isExpanded ? 'opened' : ''}` }
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            className="chevron"
            onClick={ (): void => {
              setIsExpanded(!isExpanded);
            } }
            size="small"
          >
            <SVG src={ ICONS.CHEVRON_DOWN } />
          </IconButton>
        </TableCell>
        <TableCell align="left">
          { formatDate(invoice.invoice_date) }
        </TableCell>
        <TableCell align="left">
          { customerName || invoice.custom_org_name }
        </TableCell>
        <TableCell align="left">
          { invoice.invoice_ident }
        </TableCell>
        <TableCell align="right">
          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(invoice.gross_amount) }
        </TableCell>
        <TableCell align="left">
          { formatDate(invoice.due_date) }
        </TableCell>
        <TableCell align="left">
          { invoice.payment_date ? formatDate(invoice.payment_date) : getText() }
        </TableCell>
        <TableCell align="left">{ invoice.payment_date ? t('invoices.table.yes') : t('invoices.table.no') }</TableCell>
        <TableCell
          align="left"
          className="actions"
        >
          <div className="actions-wrapper">
            <Link
              color="primary"
              onClick={ (): void => {
                history.push(`${ROUTES.AUTHORIZED.INVOICES}/${invoice.id}`);
              } }
            >
              { t('invoices.table.edit') }
            </Link>
            <Link
              color="primary"
              onClick={ (): void => onDelete() }
            >
              { t('invoices.table.delete') }
            </Link>
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
        expanded: isExpanded
      }) }
      >
        <TableCell
          colSpan={ 12 }
          style={ { padding: 0, border: 0 } }
        >
          <Collapse
            in={ isExpanded }
            timeout="auto"
          >
            <Box margin={ 1 }>
              <Grid
                container
                spacing={ 3 }
                style={ { placeItems: 'center', padding: '20px 6px', width: '100%' } }
              >
                <Grid
                  item
                  xs={ 3 }
                >
                  <div className="invoice-detail">
                    <Typography
                      className="invoice-detail-title"
                      variant="subtitle2"
                    >
                      { t('invoices.form.fields.customer_number') }
                    </Typography>
                    { getText(invoice.customer_ident) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 3 }
                >
                  <div className="invoice-detail">
                    <Typography
                      className="invoice-detail-title"
                      variant="subtitle2"
                    >
                      { t('invoices.form.fields.street_address') }
                    </Typography>
                    { getText(addressData?.street) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 3 }
                >
                  <div className="invoice-detail">
                    <Typography
                      className="invoice-detail-title"
                      variant="subtitle2"
                    >
                      { t('invoices.form.fields.code_city') }
                    </Typography>
                    { getText(addressData?.codeAndCity) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 3 }
                >
                  <div className="invoice-detail">
                    <Typography
                      className="invoice-detail-title"
                      variant="subtitle2"
                    >
                      { t('invoices.form.fields.country') }
                    </Typography>
                    { getText(addressData?.country) }
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
