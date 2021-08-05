import { Button, Typography } from '@material-ui/core';
import { format, parse } from 'date-fns';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

import styles from './styles';
import de from '@/data/countries/de.json';
import en from '@/data/countries/en.json';
import { AppState } from '@/reducers';
import { getCurrentDateFormat, formatDate } from '@/utils/format';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';
import { usePartnerId } from '@/utils/partnerId';
import { traderReports } from '@/utils/trackingEvents';

type TableData = {
  paymentDate: string | null;
  tradingDate: string;
  tradeAmount: number;
  cashbackAmount: number;
  context: string;
}

interface Props {
  data: TableData[];
  startDate: string;
  endDate: string;
  onReturnButtonClick: () => void;
  totalAmount: number;
}

const Table = ({ data, startDate, endDate, onReturnButtonClick, totalAmount }: Props): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const { t, i18n: i18nInstance } = useTranslation();

  const user = useSelector((state: AppState) => state.auth.user);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null
  });

  const sortedData = useMemo(() => data.sort((a, b) => {
    const firstDate = parse(a.tradingDate, 'yyyy/MM/dd', new Date());
    const secondDate = parse(b.tradingDate, 'yyyy/MM/dd', new Date());

    return firstDate.getTime() - secondDate.getTime();
  }), [data]);

  const parsedAddress = useMemo(() => {
    if (!user) {
      return {
        street: '',
        houseNo: '',
        zip: '',
        city: '',
        country: ''
      };
    }

    const addressData = user.address.split(';');
    let userCountry = addressData[4] || '';

    if (userCountry && getCurrentLanguage() === 'de') {
      const enId = en.find((value) => value.name === userCountry.trim())?.id;

      if (enId) {
        userCountry = de.find((country) => country.id === enId)?.name || '';
      }
    }

    if (userCountry === 'Germany' || userCountry === 'Deutschland') {
      userCountry = '';
    }

    return {
      street: addressData[0] || '',
      houseNo: addressData[1] || '',
      zip: addressData[2] || '',
      city: addressData[3] || '',
      country: userCountry || ''
    };
  }, [user]);

  return (
    <>
      <p>{ t('reports.preview_description') }</p>
      <div className={ classes.button }>
        <Button
          color="secondary"
          onClick={ (): void => {
            traderReports.sendBackButtonClickEvent(partnerId);
            onReturnButtonClick();
          } }
          size="large"
          variant="contained"
        >
          { t('reports.go_back') }
        </Button>
        <Button
          color="primary"
          onClick={ (): void => {
            traderReports.sendPrintButtonClickEvent(partnerId);

            if (handlePrint) {
              handlePrint();
            }
          } }
          size="large"
          variant="contained"
        >
          { t('reports.print') }
        </Button>
      </div>
      <div
        ref={ componentRef }
        className={ classes.root }
      >
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('reports.preview_title') }
        </Typography>
        <Typography
          className={ classes.sectionTitle }
          variant="h6"
        >
          {
            parsedAddress.country
              ? t('reports.name_and_address_with_country', { firstName: user?.firstname, lastName: user?.lastname, street: parsedAddress.street, houseNo: parsedAddress.houseNo, zip: parsedAddress.zip, city: parsedAddress.city, country: parsedAddress.country })
              : t('reports.name_and_address', { firstName: user?.firstname, lastName: user?.lastname, street: parsedAddress.street, houseNo: parsedAddress.houseNo, zip: parsedAddress.zip, city: parsedAddress.city })
          }
        </Typography>
        <Typography
          className={ classes.sectionTitle }
          variant="h6"
        >
          { t('reports.reporting_period', { start: formatDate(startDate), end: formatDate(endDate) }) }
        </Typography>
        <Typography
          className={ classes.sectionTitle }
          variant="h6"
        >
          { t('reports.total_cashback_amount', { amount: new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(totalAmount) }) }
        </Typography>
        <Typography
          className={ classes.sectionTitle }
          variant="h6"
        >
          { t('reports.cash_back_in_details') }
        </Typography>
        { sortedData && (
          <table>
            <thead>
              <tr>
                <th>{ t('reports.table.trading_date') }</th>
                <th>{ t('reports.table.context') }</th>
                <th>{ t('reports.table.trade_amount') }</th>
                <th>{ t('reports.table.payment_date') }</th>
                <th>{ t('reports.table.cashback_amount') }</th>
              </tr>
            </thead>
            <tbody>
              {
                sortedData.map((cashback, index) => (
                  <tr key={ index }>
                    <td>{ format(parse(cashback.tradingDate, 'yyyy/MM/dd', new Date()), getCurrentDateFormat()) }</td>
                    <td>{ cashback.context }</td>
                    <td>{ new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(cashback.tradeAmount) }</td>
                    <td>{ cashback.paymentDate ? format(parse(cashback.paymentDate, 'yyyy/MM/dd', new Date()), getCurrentDateFormat()) : '' }</td>
                    <td>{ new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(cashback.cashbackAmount) }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) }
      </div>
    </>
  );
};

export default Table;
