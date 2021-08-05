import DateFnsUtils from '@date-io/date-fns';
import { Button, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { format, parse } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Table from './components/Table';
import styles from './styles';
import { Cashback } from '@/interfaces';
import APIService from '@/services/APIService';
import { getCurrentDateFormat } from '@/utils/format';
import { usePartnerId } from '@/utils/partnerId';
import { traderReports } from '@/utils/trackingEvents';


class DeLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date: Date): string {
    return format(date, 'EEE MMM d', { locale: this.locale });
  }
}

const localeMap = {
  de: deLocale,
  en: enLocale
};

const localeUtilsMap = {
  de: DeLocalizedUtils,
  en: DateFnsUtils
};

type TableData = {
  paymentDate: string | null;
  tradingDate: string;
  tradeAmount: number;
  cashbackAmount: number;
  context: string;
}

const Reports = (): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const { t, i18n: i18nInstance } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [cashbacks, setCashbacks] = useState<Cashback[]>([]);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [printableCashbacks, setPrintableCashbacks] = useState<TableData[]>([]);

  const fetchCashbacks = useCallback(async (): Promise<void> => {
    const { data } = await APIService.cashbacks.getTrades();
    setCashbacks(data.cashbacks);
  }, []);

  const filterCashbacks = useCallback((): void => {
    const filteredCashbacks = cashbacks
      .filter((cashback) => (
        startDate && endDate && (
          parse(cashback.value_date, 'yyyy/MM/dd', new Date()) >= new Date(startDate.setHours(0, 0, 0, 0))
            && parse(cashback.value_date, 'yyyy/MM/dd', new Date()) <= new Date(endDate.setHours(0, 0, 0, 0))
        )
      ));

    const mappedData = filteredCashbacks.map((cashback) => ({
      paymentDate: cashback.payout_value_date,
      tradingDate: cashback.value_date,
      tradeAmount: cashback.transaction_amount,
      cashbackAmount: cashback.reward,
      context: cashback.cashback_context
    }));

    if (!mappedData.length) {
      setError(t('reports.errors.no_data'));
    } else {
      setError('');
    }

    setPrintableCashbacks(mappedData);
  }, [cashbacks, endDate, startDate, t]);

  const activeElement = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <p>{ t('reports.description') }</p>
            <div className={ classes.pickers }>
              <MuiPickersUtilsProvider
                locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
                utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
              >
                <KeyboardDatePicker
                  format={ getCurrentDateFormat() }
                  inputVariant="outlined"
                  label={ t('reports.start_date') }
                  onChange={ (date): void => { setStartDate(new Date(date || '')); } }
                  placeholder={ getCurrentDateFormat().toUpperCase() }
                  readOnly={ false }
                  value={ startDate }
                  variant="inline"
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider
                locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
                utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
              >
                <KeyboardDatePicker
                  format={ getCurrentDateFormat() }
                  inputVariant="outlined"
                  label={ t('reports.end_date') }
                  onChange={ (date): void => { setEndDate(new Date(date || '')); } }
                  placeholder={ getCurrentDateFormat().toUpperCase() }
                  readOnly={ false }
                  value={ endDate }
                  variant="inline"
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className={ classes.button }>
              <Button
                color="primary"
                disabled={ !!error.length }
                onClick={ (): void => {
                  traderReports.sendContinueButtonClickEvent(partnerId);
                  setActiveStep(1);
                } }
                size="large"
                variant="contained"
              >
                { t('reports.continue') }
              </Button>
            </div>
            <div className={ classes.button }>
              <p>{ error }</p>
            </div>
          </>
        );
      case 1:
        return (
          <>
            { startDate && endDate && (
              <Table
                data={ printableCashbacks }
                endDate={ endDate.toISOString() }
                onReturnButtonClick={ (): void => setActiveStep(0) }
                startDate={ startDate.toISOString() }
                totalAmount={ printableCashbacks.reduce((acc, cashback) => (acc + Number(cashback.cashbackAmount)), 0) }
              />
            ) }
          </>
        );
      default:
        return null;
    }
  }, [activeStep, classes, startDate, endDate, error, i18nInstance.languages, partnerId, printableCashbacks, t]);

  useEffect(() => {
    fetchCashbacks();
  }, [fetchCashbacks]);

  useEffect(() => {
    if (endDate && startDate) {
      if (startDate <= endDate) {
        filterCashbacks();
      } else {
        setError(t('reports.errors.wrong_period'));
      }
    } else {
      setError(t('reports.select_date'));
    }
  }, [endDate, filterCashbacks, startDate, t]);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <Typography
        className={ classes.sectionTitle }
        variant="h4"
      >
        { t('reports.title') }
      </Typography>
      { activeElement }
    </div>
  );
};

export default Reports;
