/* eslint-disable @typescript-eslint/no-explicit-any */
import DateFnsUtils from '@date-io/date-fns';
import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  useTheme
} from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon
} from '@material-ui/icons';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import classNames from 'classnames';
import {
  addMonths,
  eachMonthOfInterval,
  isBefore,
  isFuture,
  isSameMonth,
  format,
  parse,
  startOfMonth,
  subMonths
} from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import tinyColor from 'tinycolor2';
import { useAsyncEffect } from 'use-async-effect';

import Chart, { SingleFinanceGroupChartData } from './components/Chart';
import Row from './components/Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION, KPI } from '@/constants';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { ConsumerType } from '@/types';
import { getCurrentLanguage } from '@/utils/languages';

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

interface SingleChartData {
  incomes: SingleFinanceGroupChartData[];
  expenses: SingleFinanceGroupChartData[];
  maxExpenses: number;
  maxIncomes: number;
  month: string;
}

interface Props {
  consumerType: ConsumerType;
}

const ProfitAndLoss = ({ consumerType }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { t, i18n: i18nInstance } = useTranslation();

  const KPIFromLocalStorage = useMemo(() => localStorage.getItem(KPI.NAME), []);
  const qclasses = useSelector((appState: AppState) => appState.cashbuzz.qclasses);

  const [chartExtremeValues, setChartExtremeValues] = useState({ min: 0, max: 0 });
  const [endDate, setEndDate] = useState(addMonths(new Date(), 3));
  const [financeGroupsChartData, setFinanceGroupsChartData] = useState<SingleChartData[]>();
  const [financeGroupsChartFutureData, setFinanceGroupsChartFutureData] = useState<SingleChartData[]>();
  const [financeGroupsTableData, setFinanceGroupsTableData] = useState<{
    incomes: {
      label: string;
      list: {
        amount: number;
        month: string;
      }[];
    }[];
    expenses: {
      label: string;
      list: {
        amount: number;
        month: string;
      }[];
    }[];
  }>();
  const [hasAccounts, setHasAccounts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [minDate, setMinDate] = useState<Date>(startOfMonth(subMonths(new Date(), 3)));
  const [startDate, setStartDate] = useState(subMonths(new Date(), 3));
  const [togglesState, setToggleState] = useState(JSON.parse(KPIFromLocalStorage === null ? '{}' : KPIFromLocalStorage));

  const sectionRef = useRef<HTMLDivElement>(null);
  const loadingIdRef = useRef<null | number>(null);

  const fetchFinanceGroups = useCallback(async (from = subMonths(new Date(), 3), to = addMonths(new Date(), 3)) => {
    try {
      const { data } = await APIService.user.getFinanceGroups(consumerType, from, to);

      let incomeClass = '';
      let expensesClass = '';
      switch (consumerType) {
        case 'general':
          incomeClass = CATEGORIZATION.FINANCIAL_GROUP_FOR_INCOME_CONSUMER;
          expensesClass = CATEGORIZATION.FINANCIAL_GROUP_FOR_EXPENSES_CONSUMER;
          break;
        case 'sme':
          incomeClass = CATEGORIZATION.FINANCIAL_GROUP_FOR_INCOME_SME;
          expensesClass = CATEGORIZATION.FINANCIAL_GROUP_FOR_EXPENSES_SME;
          break;
        default:
      }

      const filteredFinanceGroups = data.finance_groups.filter((singleGroup) => ![incomeClass, expensesClass].includes(singleGroup.label));

      const chartData = filteredFinanceGroups.reduce<{
        incomes: any;
        expenses: any;
        maxExpenses: number;
        maxIncomes: number;
        month: string;
      }[]>((previousResult, currentValue) => {
        let element = previousResult.find((singleEl) => singleEl.month === currentValue.month);

        if (!element) {
          element = { incomes: {}, expenses: {}, month: currentValue.month, maxExpenses: 0, maxIncomes: 0 };
          previousResult.push(element);
        }

        const classTree = currentValue.path.split('#');
        const qclass = qclasses.find((singleClass) => singleClass.label === currentValue.label);
        let type;

        if (classTree.includes(incomeClass)) {
          type = 'income';
        } else if (classTree.includes(expensesClass)) {
          type = 'expenses';
        } else {
          return previousResult;
        }

        switch (type) {
          case 'income':
            element.incomes[currentValue.label] = {
              color: '',
              label: currentValue.label,
              order: qclass?.order_nr || 0,
              value: currentValue.amount
            };

            element.maxIncomes += Math.abs(currentValue.amount);
            break;
          case 'expenses':
            element.expenses[currentValue.label] = {
              color: '',
              label: currentValue.label,
              order: qclass?.order_nr || 0,
              value: currentValue.amount
            };

            element.maxExpenses += Math.abs(currentValue.amount);
            break;
          default:
        }

        return previousResult;
      }, []);

      const max = Math.max(...(chartData.map((singleDataPart) => [singleDataPart.maxExpenses, singleDataPart.maxIncomes])).flat());

      chartData.forEach((singleDataPart) => {
        const isFutureTemp = isFuture(parse(singleDataPart.month, 'yyyy-MM', new Date())) || isSameMonth(parse(singleDataPart.month, 'yyyy-MM', new Date()), new Date());

        singleDataPart.incomes = Object.values(singleDataPart.incomes)
          .sort((b: any, a: any) => b.order - a.order)
          .map((value: any, index) => ({
            ...value,
            color: tinyColor(
              index % 2 === 0
                ? theme.palette.success.main
                : tinyColor(theme.palette.success.light).lighten(10)
            ).lighten(isFutureTemp ? 10 : 0)
          }));

        singleDataPart.expenses = Object.values(singleDataPart.expenses)
          .sort((b: any, a: any) => b.order - a.order)
          .map((value: any, index) => ({
            ...value,
            color: tinyColor(
              index % 2 === 0
                ? theme.palette.error.main
                : tinyColor(theme.palette.error.light).lighten(10)
            ).lighten(isFutureTemp ? 10 : 0)
          }));
      });

      const pastData = chartData.filter((singleDataPart) => !(isFuture(parse(singleDataPart.month, 'yyyy-MM', new Date())) || isSameMonth(parse(singleDataPart.month, 'yyyy-MM', new Date()), new Date())));
      const futureData = chartData.filter((singleDataPart) => isFuture(parse(singleDataPart.month, 'yyyy-MM', new Date())) || isSameMonth(parse(singleDataPart.month, 'yyyy-MM', new Date()), new Date()));

      const tableData = filteredFinanceGroups.reduce<{ incomes: any; expenses: any }>((previusValue, currentValue) => {
        const classTree = currentValue.path.split('#');
        const qclass = qclasses.find((singleClass) => singleClass.label === currentValue.label);
        let type;

        if (classTree.includes(incomeClass)) {
          type = 'income';
        } else if (classTree.includes(expensesClass)) {
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
                list: [currentValue],
                order: qclass?.order_nr || 0
              };
            }
            break;
          case 'expenses':
            if (previusValue.expenses[currentValue.label]) {
              previusValue.expenses[currentValue.label].list.push(currentValue);
            } else {
              previusValue.expenses[currentValue.label] = {
                label: currentValue.label,
                list: [currentValue],
                order: qclass?.order_nr || 0
              };
            }
            break;
          default:
        }

        return previusValue;
      }, { incomes: {}, expenses: {} });

      tableData.incomes = Object.values(tableData.incomes).sort((b: any, a: any) => b.order - a.order);
      tableData.expenses = Object.values(tableData.expenses).sort((b: any, a: any) => b.order - a.order);

      setChartExtremeValues({ min: 0, max });
      setFinanceGroupsChartData(pastData);
      setFinanceGroupsChartFutureData(futureData);
      setFinanceGroupsTableData({ expenses: Object.values(tableData.expenses), incomes: Object.values(tableData.incomes) });
    } catch {
      // showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [consumerType, qclasses, theme]);

  useAsyncEffect(async () => {
    if (!hasAccounts) {
      return;
    }

    setIsLoading(true);
    const oldestTransaction = await APIService.transaction.getOldestTransaction();

    if (oldestTransaction) {
      setMinDate(startOfMonth(parse(oldestTransaction.valueDate, 'yyyy-MM-dd', new Date())));
    }
    await fetchFinanceGroups(startDate, endDate);
  }, [hasAccounts, endDate, fetchFinanceGroups, startDate]);

  useAsyncEffect(async () => {
    const { data } = await APIService.account.getAll();

    const filteredAccounts = data.accounts.filter((singleAccount) => singleAccount.is_selected || singleAccount.is_selected === null);

    setHasAccounts(!!filteredAccounts.length);
    if (!filteredAccounts.length) {
      setIsLoading(false);
    }
  }, [consumerType, fetchFinanceGroups, t, theme]);

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
      <div
        ref={ sectionRef }
        className={ `${classes.root}-table-section section` }
      >
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t(`profits_and_loss.${consumerType}.title`) }
        </Typography>
        {
          hasAccounts
            ? (
              <>
                <MuiPickersUtilsProvider
                  locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
                  utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
                >
                  <Grid
                    className={ classes.pickerSection }
                    container
                    spacing={ 2 }
                  >
                    <Grid item>
                      <DatePicker
                        format="MMMM yyyy"
                        inputVariant="outlined"
                        label={ t('profits_and_loss.start_date') }
                        maxDate={ endDate }
                        minDate={ minDate }
                        onChange={ (date): void => {
                          if (!date) {
                            return;
                          }
                          setStartDate(isBefore(date, minDate) ? minDate : new Date(date));
                        } }
                        openTo="month"
                        PopoverProps={ {
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left'
                          }
                        } }
                        rightArrowIcon={ <CalendarTodayIcon /> }
                        value={ startDate }
                        variant="inline"
                        views={ ['year', 'month'] }
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        format="MMMM yyyy"
                        inputVariant="outlined"
                        label={ t('profits_and_loss.end_date') }
                        minDate={ startDate }
                        onChange={ (date): void => { setEndDate(new Date(date || '')); } }
                        openTo="month"
                        PopoverProps={ {
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left'
                          }
                        } }
                        value={ endDate }
                        variant="inline"
                        views={ ['year', 'month'] }
                      />
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
                <TableContainer
                  component={ Paper }
                  style={ { overflowY: 'scroll', overflowX: 'auto', maxHeight: '90vh' } }
                >
                  <Table
                    stickyHeader
                    style={ { overflowY: 'scroll', maxHeight: 600 } }
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={ { minWidth: 63, width: 63, maxWidth: 63 } } />
                        <TableCell style={ { minWidth: 155, width: 155 } }>
                          { t('profits_and_loss.table.columns.type') }
                        </TableCell>
                        <TableCell style={ { minWidth: 70, width: 70, maxWidth: 70, whiteSpace: 'nowrap' } }>
                          { t('profits_and_loss.table.columns.toggle') }
                        </TableCell>
                        {
                          eachMonthOfInterval({ start: startDate, end: endDate }).map((singleDate) => (
                            <TableCell
                              key={ singleDate.toString() }
                              align="center"
                              className={ classNames({
                                future: isFuture(singleDate) || isSameMonth(singleDate, new Date()),
                                [classes.financeGroupTableHeaderCell]: true
                              }) }
                              style={ { minWidth: 148, width: 148 } }
                            >
                              { format(singleDate, 'MMMM yy', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale }) }
                            </TableCell>
                          ))
                        }
                      </TableRow>
                    </TableHead>
                    <CustomTableBody
                      customEmptyText={ t('profits_and_loss.table.no_data') }
                      empty={ !(financeGroupsChartData || []).concat(financeGroupsChartFutureData || []).length }
                      loading={ isLoading }
                    >
                      <TableRow>
                        <TableCell style={ { minWidth: 63, width: 63, maxWidth: 63 } } />
                        <TableCell style={ { minWidth: 155, width: 155 } } />
                        <TableCell style={ { minWidth: 70, width: 70, maxWidth: 70 } } />
                        {
                          (financeGroupsChartData || []).map((singleDataPart, index) => (
                            <TableCell
                              key={ index }
                              className={ classes.financeGroupTableChartCell }
                            >
                              <Chart
                                expenses={ singleDataPart.expenses }
                                incomes={ singleDataPart.incomes }
                                month={ singleDataPart.month }
                                tickValues={ chartExtremeValues }
                              />
                            </TableCell>
                          ))
                        }
                        {
                          (financeGroupsChartFutureData || []).map((singleDataPart, index) => (
                            <TableCell
                              key={ index }
                              className={ classes.financeGroupTableChartCell }
                            >
                              <Chart
                                expenses={ singleDataPart.expenses }
                                incomes={ singleDataPart.incomes }
                                month={ singleDataPart.month }
                                tickValues={ chartExtremeValues }
                              />
                            </TableCell>
                          ))
                        }
                      </TableRow>
                      {
                        financeGroupsTableData && Object.entries(financeGroupsTableData || {}).reverse()
                          .map(([key, value]) => (
                            <Row
                              key={ key }
                              consumerType={ consumerType }
                              data={ value.map((singleValue) => ({ ...singleValue, toggle: togglesState[singleValue.label] })) }
                              endDate={ endDate }
                              onChange={ (toggle, onChangeValue): void => {
                                localStorage.setItem(KPI.NAME, JSON.stringify(
                                  { ...togglesState, [toggle]: onChangeValue }
                                ));

                                setToggleState({ ...togglesState, [toggle]: onChangeValue });
                              } }
                              startDate={ startDate }
                              toggle={ togglesState[key] === 'on' }
                              type={ key }
                            />
                          ))
                      }
                    </CustomTableBody>
                  </Table>
                </TableContainer>
              </>
            )
            : !isLoading && (
              <Typography>
                { t('profits_and_loss.no_data') }
              </Typography>
            )
        }
      </div>
    </div>
  );
};

export default ProfitAndLoss;
