/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import DateFnsUtils from '@date-io/date-fns';
import {
  Paper,
  Divider,
  Typography,
  useTheme
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {
  addMonths,
  isAfter,
  isFuture,
  isSameMonth,
  format,
  parse,
  subMonths
} from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaSeries, Hint, LineMarkSeries, XYPlot, XAxis, YAxis, HorizontalGridLines } from 'react-vis';

import styles from './styles';
import KPICards from '../components/KPICards';
import { loading, closeLoading } from '@/components/CustomLoader';
import { CATEGORIZATION } from '@/constants';
import { Account, LiquidityChartData, Suggestion, Pagination, FinanceGroup, Transaction } from '@/interfaces';
import APIService from '@/services/APIService';
import { getLiquidityData } from '@/utils/charts';
import { formatDateWithoutYear } from '@/utils/format';
import { getCurrentDateFormat } from '@/utils/format';
import { to6391Format } from '@/utils/languages';
import Hints from '@/views/DashboardView/components/Hints';
import StatusBar from '@/views/DashboardView/components/StatusBar';

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


interface Props {
  accounts: Account[];
}

const Liquidity = ({ accounts }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { t, i18n: i18nInstance } = useTranslation();

  const [chartWidth, setChartWitdth] = useState(0);
  const [financeGroupsChartData, setFinanceGroupsChartData] = useState<{
    incomes: {
      label: string;
      list: FinanceGroup[];
    }[];
    expenses: {
      label: string;
      list: FinanceGroup[];
    }[]; }>();
  const [financeGroupsChartFutureData, setFinanceGroupsChartFutureData] = useState<{
      incomes: {
        label: string;
        list: FinanceGroup[];
      }[];
      expenses: {
        label: string;
        list: FinanceGroup[];
      }[]; }>();
  const [liquidityChartData, setLiquidityChartData] = useState<LiquidityChartData>({ data: [], max: 0, min: 0 });
  const [liquidityMinBookingDate, setLiquidityMinBookingDate] = useState(subMonths(new Date(), 5));
  const [liquidityMaxBookingDate, setLiquidityMaxBookingDate] = useState(addMonths(new Date(), 3));
  const [liquidityOldestTransactionDate, setLiquidityOldestTransactionDate] = useState<Date>();
  const [liquidityChartDataFutureIndex, setLiquidityChartDataFutureIndex] = useState(0);
  const [liquidityHintValue, setLiquidityHintValue] = useState<{ x: number | string | Date; y: number | string | Date }>();
  const [liquidityHintText, setLiquidityHintText] = useState<string>(t('overview.sme.liquidity_chart.hint.value'));
  const [isLoading, setIsLoading] = useState(true);
  const [currentHints, setCurrentHints] = useState<Suggestion[]>([]);
  const [hintsPagination, setHintsPagination] = useState<Pagination>();
  const [hintsActivePage, setHintsActivePage] = useState(1);
  const [statusBarSuggestions, setStatusBarSuggestions] = useState<Suggestion[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const elementRef = useRef<HTMLDivElement>(null);
  const isInitRef = useRef(true);
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
    (async (): Promise<void> => {
      if (isInitRef.current) {
        return;
      }

      try {
        setIsLoading(true);
        let tempTransactions: Transaction[] = [];
        let page = 1;

        while (true) {
          const { data } = await APIService.transaction.getAllByPeriod(format(liquidityMinBookingDate, 'yyyy-MM-dd'), format(liquidityMaxBookingDate, 'yyyy-MM-dd'), page, 1000000);
          tempTransactions = tempTransactions.concat(data.transactions);

          if (data.paging.pageCount === page) {
            break;
          }

          page += 1;
        }
        setTransactions(tempTransactions);

        const chartData = getLiquidityData(tempTransactions, liquidityMinBookingDate, liquidityMaxBookingDate, accounts);
        setLiquidityChartDataFutureIndex(chartData.data.findIndex((singleData) => singleData.predicted) + 1 || chartData.data.length);
        setLiquidityChartData(chartData);
      } catch {
        // showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accounts, liquidityMinBookingDate, liquidityMaxBookingDate]);

  useEffect(() => {
    if (elementRef.current) {
      setChartWitdth(elementRef.current.offsetWidth);
    }

    const fetchLiquidityData = async (): Promise<void> => {
      try {
        let minDate = subMonths(new Date(), 5);
        const maxDate = addMonths(new Date(), 3);

        const oldestTransaction = await APIService.transaction.getOldestTransaction();
        if (oldestTransaction) {
          const oldestTransactionDate = parse(oldestTransaction.valueDate, 'yyyy-MM-dd', new Date());

          if (isAfter(oldestTransactionDate, minDate)) {
            setLiquidityMinBookingDate(oldestTransactionDate);
            minDate = oldestTransactionDate;
          }
          setLiquidityOldestTransactionDate(oldestTransactionDate);
        } else {
          setLiquidityOldestTransactionDate(undefined);
        }

        let tempTransactions: Transaction[] = [];
        let page = 1;

        while (true) {
          const { data } = await APIService.transaction.getAllByPeriod(format(minDate, 'yyyy-MM-dd'), format(maxDate, 'yyyy-MM-dd'), page, 1000000);
          tempTransactions = tempTransactions.concat(data.transactions);

          if (data.paging.pageCount === page) {
            break;
          }

          page += 1;
        }
        setTransactions(tempTransactions);

        const chartData = getLiquidityData(tempTransactions, minDate, maxDate, accounts);
        setLiquidityChartDataFutureIndex(chartData.data.findIndex((singleData) => singleData.predicted) + 1 || chartData.data.length);
        setLiquidityChartData(chartData);
      } catch {
        setIsLoading(false);
        // showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    };

    const fetchFinanceGroups = async (): Promise<void> => {
      try {
        const { data } = await APIService.user.getFinanceGroups('sme');

        const filteredFinanceGroups = data.finance_groups.filter(
          (singleGroup) => ![CATEGORIZATION.FINANCIAL_GROUP_FOR_INCOME_SME, CATEGORIZATION.FINANCIAL_GROUP_FOR_EXPENSES_SME].includes(singleGroup.label)
        );

        const mappedData = filteredFinanceGroups.reduce<{ incomes: any; expenses: any }>((previusValue, currentValue) => {
          const classTree = currentValue.path.split('#');
          let type;

          if (classTree.includes(CATEGORIZATION.FINANCIAL_GROUP_FOR_INCOME_SME)) {
            type = 'income';
          } else if (classTree.includes(CATEGORIZATION.FINANCIAL_GROUP_FOR_EXPENSES_SME)) {
            type = 'expenses';
          } else {
            return previusValue;
          }

          switch (type) {
            case 'income':
              if (previusValue.incomes[currentValue.label]) {
                previusValue.incomes[currentValue.label].list.push(currentValue);
              } else {
                previusValue.incomes[currentValue.label] = {
                  label: currentValue.label,
                  list: [currentValue]
                };
              }
              break;
            case 'expenses':
              if (previusValue.expenses[currentValue.label]) {
                previusValue.expenses[currentValue.label].list.push(currentValue);
              } else {
                previusValue.expenses[currentValue.label] = {
                  label: currentValue.label,
                  list: [currentValue]
                };
              }
              break;
            default:
          }

          return previusValue;
        }, { incomes: {}, expenses: {} });

        const pastAndCurrentIncomes = Object.values(mappedData.incomes).map((value: any) => ({
          label: value.label,
          list: value.list.filter((singleValue: any) => !isFuture(parse(singleValue.month, 'yyyy-MM', new Date())) && !isSameMonth(parse(singleValue.month, 'yyyy-MM', new Date()), new Date()))
        }));

        const futureIncomes = Object.values(mappedData.incomes).map((value: any) => ({
          label: value.label,
          list: value.list.filter((singleValue: any) => isFuture(parse(singleValue.month, 'yyyy-MM', new Date())) || isSameMonth(parse(singleValue.month, 'yyyy-MM', new Date()), new Date()))
        }));

        const pastAndCurrentExpenses = Object.values(mappedData.expenses).map((value: any) => ({
          label: value.label,
          list: value.list.filter((singleValue: any) => !isFuture(parse(singleValue.month, 'yyyy-MM', new Date())) && !isSameMonth(parse(singleValue.month, 'yyyy-MM', new Date()), new Date()))
        }));

        const futureExpenses = Object.values(mappedData.expenses).map((value: any) => ({
          label: value.label,
          list: value.list.filter((singleValue: any) => isFuture(parse(singleValue.month, 'yyyy-MM', new Date())) || isSameMonth(parse(singleValue.month, 'yyyy-MM', new Date()), new Date()))
        }));

        setFinanceGroupsChartData({ expenses: pastAndCurrentExpenses, incomes: pastAndCurrentIncomes });
        setFinanceGroupsChartFutureData({ expenses: futureExpenses, incomes: futureIncomes });
      } catch {
        setIsLoading(false);
        // showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    };

    const fetchAll = async (): Promise<void> => {
      setIsLoading(true);
      await fetchLiquidityData();
      await fetchFinanceGroups();
      await fetchSuggestions(1, false);
      setIsLoading(false);
      isInitRef.current = false;
    };

    fetchAll();
  }, [accounts, fetchSuggestions]);

  useEffect(() => {
    const resizeHandler = (): void => {
      if (elementRef.current) {
        setChartWitdth(elementRef.current.offsetWidth);
      }

      const chartData = getLiquidityData(transactions, liquidityMinBookingDate, liquidityMaxBookingDate, accounts);
      setLiquidityChartDataFutureIndex(chartData.data.findIndex((singleData) => singleData.predicted) + 1 || chartData.data.length);
      setLiquidityChartData(chartData);
    };

    window.addEventListener('resize', resizeHandler);

    return (): void => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [accounts, liquidityMinBookingDate, liquidityMaxBookingDate, transactions]);

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
    <div
      ref={ elementRef }
      className={ `${classes.root} dashboard-view-element-root` }
    >
      <StatusBar
        accounts={ accounts }
        messages={ statusBarSuggestions }
        type="SME"
      />
      <div className={ `${classes.root}-chart-section section` }>
        <div className="liquidity-chart">
          <Typography
            className="section-title"
            variant="h4"
          >
            { t('overview.sme.liquidity_chart.title') }
          </Typography>
          { accounts.length ? (
            <Paper>
              <div className={ classes.liquidityPickerSection }>
                <MuiPickersUtilsProvider
                  locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
                  utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
                >
                  <KeyboardDatePicker
                    autoOk
                    format={ getCurrentDateFormat() }
                    inputVariant="outlined"
                    label={ t('overview.sme.liquidity_chart.start_date') }
                    maxDate={ liquidityMaxBookingDate }
                    minDate={ liquidityOldestTransactionDate }
                    onChange={ (date): void => { setLiquidityMinBookingDate(new Date(date || '')); } }
                    placeholder={ getCurrentDateFormat().toUpperCase() }
                    readOnly={ false }
                    value={ liquidityMinBookingDate }
                    variant="inline"
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider
                  locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
                  utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
                >
                  <KeyboardDatePicker
                    autoOk
                    format={ getCurrentDateFormat() }
                    inputVariant="outlined"
                    label={ t('overview.sme.liquidity_chart.end_date') }
                    minDate={ liquidityMinBookingDate }
                    onChange={ (date): void => { setLiquidityMaxBookingDate(new Date(date || '')); } }
                    placeholder={ getCurrentDateFormat().toUpperCase() }
                    readOnly={ false }
                    value={ liquidityMaxBookingDate }
                    variant="inline"
                  />
                </MuiPickersUtilsProvider>
              </div>
              <XYPlot
                animation
                height={ 300 }
                margin={ { left: 100, bottom: 50 } }
                onMouseLeave={ (): void => { setLiquidityHintValue(undefined); } }
                width={ chartWidth }
                yDomain={ [liquidityChartData.min, liquidityChartData.max + 5000] }
              >
                <HorizontalGridLines />
                <XAxis
                  tickFormat={ (value: number): string => formatDateWithoutYear(new Date(value).toISOString()) }
                  tickLabelAngle={ -90 }
                  tickTotal={ 40 }
                  tickValues={ liquidityChartData.data.map((singleData) => singleData.start.getTime()) }
                />
                <YAxis
                  tickFormat={ (value): string => new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', minimumFractionDigits: 0, currency: 'EUR' }).format(Number(value)) }
                  tickTotal={ 10 }
                />
                <AreaSeries
                  color={ theme.palette.primary.main }
                  data={ liquidityChartData.data.slice(0, liquidityChartDataFutureIndex).map((period) => ({
                    x: period.start.getTime(),
                    y: period.balance
                  })) }
                  opacity={ 0.4 }
                />
                <AreaSeries
                  color={ theme.custom.colors.neutral }
                  data={ liquidityChartData.data.slice(liquidityChartDataFutureIndex - 1, liquidityChartData.data.length).map((period) => ({
                    x: period.start.getTime(),
                    y: period.balance
                  })) }
                  opacity={ 0.4 }
                />
                <LineMarkSeries
                  color={ theme.custom.colors.neutral }
                  data={ liquidityChartData.data.slice(liquidityChartDataFutureIndex - 1, liquidityChartData.data.length).map((period) => ({
                    x: period.start.getTime(),
                    y: period.balance
                  })) }
                  onValueMouseOver={ (value): void => {
                    setLiquidityHintText(t('overview.sme.liquidity_chart.hint.weekly_value'));
                    setLiquidityHintValue({ x: value.x, y: value.y });
                  } }
                />
                <LineMarkSeries
                  color={ theme.palette.primary.main }
                  data={ liquidityChartData.data.slice(0, liquidityChartDataFutureIndex).map((period) => ({
                    x: period.start.getTime(),
                    y: period.balance
                  })) }
                  onValueMouseOver={ (value): void => {
                    setLiquidityHintText(t('overview.sme.liquidity_chart.hint.weekly_value'));
                    setLiquidityHintValue({ x: value.x, y: value.y });
                  } }
                />
                {
                  liquidityHintValue && (
                    <Hint value={ liquidityHintValue }>
                      <div className={ classes.hint }>
                        <Typography variant="subtitle2">
                          { liquidityHintText }
                        </Typography>
                        <Typography variant="subtitle2">
                          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(Number(liquidityHintValue.y)) }
                        </Typography>
                      </div>
                    </Hint>
                  )
                }
              </XYPlot>
            </Paper>
          ) : (<p>{ t('overview.sme.liquidity_chart.no_data') }</p>) }
        </div>
      </div>
      <Divider style={ { marginTop: '40px', marginBottom: '40px' } } />
      <KPICards
        accounts={ accounts }
        financeGroupsChartData={ financeGroupsChartData }
        financeGroupsChartFutureData={ financeGroupsChartFutureData }
      />
      { currentHints.length > 0 && (
        <>
          <Divider style={ { marginTop: '40px', marginBottom: '40px' } } />
          <Hints
            activePage={ hintsActivePage }
            hints={ currentHints }
            isLoading={ isLoading }
            onPageChange={ (page): void => setHintsActivePage(page) }
            pagination={ hintsPagination }
          />
        </>
      ) }
    </div>
  );
};

export default Liquidity;
