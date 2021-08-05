/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import DateFnsUtils from '@date-io/date-fns';
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {
  addMonths,
  format,
  parse,
  startOfMonth,
  subMonths
} from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import distinctColors from 'distinct-colors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAsyncEffect } from 'use-async-effect';

import Row, { SingleAffinity } from './components/Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import SunburstWithLegend from '@/components/SunburstWithLegend';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION } from '@/constants';
import { DescriptionQClass, Pagination } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { getCurrentDateFormat } from '@/utils/format';
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

const MAX_CHART_WIDTH = 250;

interface Props {
  withTree?: boolean;
}

const Affinities = ({ withTree = false }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { t, i18n: i18nInstance } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [activePage, setActivePage] = useState(1);
  const [affinities, setAffinities] = useState<SingleAffinity[]>([]);
  const [chartWidth, setChartWitdth] = useState(0);
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 3));
  const [expensesByCategoryData, setExpensesByCategoryData] = useState<any>({ children: [], maxDeep: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [incomeByCategoryData, setIncomeByCategoryData] = useState<any>({ children: [], maxDeep: 0 });
  const [minDate, setMinDate] = useState<Date>(startOfMonth(subMonths(new Date(), 3)));
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 3));
  const [pagination, setPagination] = useState<Pagination>();

  const elementRef = useRef<HTMLDivElement>(null);
  const isInitRef = useRef(true);
  const loadingIdRef = useRef<null|number>(null);

  const fetchChartData = useCallback(async (fromDate: Date, toDate: Date, withLoading = true): Promise<void> => {
    if (withLoading) {
      setIsLoading(true);
    }
    const { data } = await APIService.transaction.getAllByPeriod(format(fromDate, 'yyyy-MM-dd'), format(toDate, 'yyyy-MM-dd'), 1, 1000000000);
    let helpIndex = 0;

    const tempIncomeByCategoryData: { children: any[]; maxDeep: number } = { children: [], maxDeep: 0 };
    const tempExpensesByCategoryData: { children: any[]; maxDeep: number } = { children: [], maxDeep: 0 };

    const currentLanguage = getCurrentLanguage();

    function propagateColor(el: any, color: string): void {
      el.hex = color;

      if (el.children) {
        el.children.forEach((tempData: any) => {
          tempData.hex = color;

          if (tempData.children) {
            propagateColor(tempData, color);
          }
        });
      }
    }

    for (const transaction of data.transactions) {
      const categoryClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === transaction.group_gstd);
      const categoryClassTree = categoryClass?.category_path.split('#').filter((singleClass) => !CATEGORIZATION.MEANINGLESS_CLASSES.includes(singleClass));

      if (categoryClassTree?.length && categoryClass) {
        if (transaction.amount === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }

        let chartPart: any;
        if (transaction.amount > 0) {
          if (tempIncomeByCategoryData.maxDeep < categoryClassTree.length) {
            tempIncomeByCategoryData.maxDeep = categoryClassTree.length;
          }

          chartPart = tempIncomeByCategoryData;
        } else {
          if (tempExpensesByCategoryData.maxDeep < categoryClassTree.length) {
            tempExpensesByCategoryData.maxDeep = categoryClassTree.length;
          }

          chartPart = tempExpensesByCategoryData;
        }

        categoryClassTree.forEach((singleClass) => {
          const tempTreeClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === singleClass);
          const tempChartPart = chartPart.children?.find((singleChartPart: any) => singleChartPart.class === singleClass);

          if (!tempTreeClass) {
            return;
          }

          const roundedAmount = Number(transaction.amount.toFixed(2));

          if (tempChartPart) {
            tempChartPart.amount_total = Number((tempChartPart.amount_total + roundedAmount).toFixed(2));

            if (tempChartPart.value) {
              tempChartPart.value = Number((tempChartPart.value + roundedAmount).toFixed(2));
            }
            chartPart = tempChartPart;
          } else {
            const newChartPart = {
              amount_total: roundedAmount,
              class: singleClass,
              currency: transaction.displayCurrency,
              id: helpIndex++,
              name: currentLanguage === 'en' ? tempTreeClass.label_en : tempTreeClass.label_de,
              value: roundedAmount
            };

            if (chartPart.value) {
              chartPart.value = undefined;
            }

            if (!chartPart.children) {
              chartPart.children = [];
            }

            chartPart.children.push(newChartPart);
            chartPart = newChartPart;
          }
        });
      }
    }

    const expensesColors = distinctColors({
      count: tempExpensesByCategoryData.children.length
    });

    const incomeExpenses = distinctColors({
      count: tempIncomeByCategoryData.children.length
    });

    tempExpensesByCategoryData.children.forEach((tempData, index) => {
      const color = expensesColors[index].hex();
      tempData.hex = color;

      if (tempData.children) {
        tempData.children.forEach((tempDataChild: any) => {
          propagateColor(tempDataChild, color);
        });
      }
    });

    tempIncomeByCategoryData.children.forEach((tempData, index) => {
      const color = incomeExpenses[index].hex();
      tempData.hex = color;

      if (tempData.children) {
        tempData.children.forEach((tempDataChild: any) => {
          propagateColor(tempDataChild, color);
        });
      }
    });

    setIncomeByCategoryData(tempIncomeByCategoryData);
    setExpensesByCategoryData(tempExpensesByCategoryData);
    if (withLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses]);

  const fetchAffinities = useCallback(async (page: number, withLoading = true): Promise<void> => {
    if (withLoading) {
      setIsLoading(true);
    }
    const { data } = await APIService.affinities.getAll(page, 10, theme.custom.affinities_classes);

    const mappedAffinities: SingleAffinity[] = data.affinities.map((affinity) => {
      const descriptionClass = cashbuzzQClasses?.find((cashbuzzClass) => cashbuzzClass.label === affinity.class) || undefined;
      const descriptionTree: DescriptionQClass[] = [];

      if (descriptionClass && withTree) {
        const treeArray = descriptionClass.category_path.split('#').filter((singleClass) => !CATEGORIZATION.MEANINGLESS_CLASSES.includes(singleClass));

        treeArray.forEach((singleClass) => {
          const tempDescription = cashbuzzQClasses?.find((cashbuzzClass) => cashbuzzClass.label === singleClass);

          if (tempDescription) {
            descriptionTree.push(tempDescription);
          }
        });
      }

      return {
        affinity,
        descriptionClass: cashbuzzQClasses?.find((cashbuzzClass) => cashbuzzClass.label === affinity.class) || undefined,
        index: 0,
        tree: descriptionTree.length ? descriptionTree : undefined
      };
    });

    setAffinities(mappedAffinities);
    setPagination(data.paging);
    if (withLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses, theme, withTree]);

  useEffect(() => {
    if (!isInitRef.current) {
      fetchAffinities(activePage);
    }
  }, [activePage, fetchAffinities]);

  useEffect(() => {
    if (!isInitRef.current) {
      fetchChartData(startDate, endDate);
    }
  }, [endDate, fetchChartData, startDate]);

  useAsyncEffect(async () => {
    const oldestTransaction = await APIService.transaction.getOldestTransaction();

    if (oldestTransaction) {
      setMinDate(startOfMonth(parse(oldestTransaction.valueDate, 'yyyy-MM-dd', new Date())));
    }

    setIsLoading(true);
    await fetchAffinities(1, false);
    await fetchChartData(startOfMonth(subMonths(new Date(), 3)), addMonths(new Date(), 3), false);
    setIsLoading(false);
    isInitRef.current = false;
  }, [fetchAffinities, fetchChartData]);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => {
    if (elementRef.current) {
      const multiplier = window.innerWidth > 780 ? 2 : 1;
      const newChartWidth = elementRef.current.offsetWidth / multiplier - 40;

      setChartWitdth(newChartWidth > MAX_CHART_WIDTH ? MAX_CHART_WIDTH : newChartWidth);
    }

    const resizeHandler = (): void => {
      if (elementRef.current) {
        const multiplier = window.innerWidth > 780 ? 2 : 1;
        const newChartWidth = elementRef.current.offsetWidth / multiplier - 40;

        setChartWitdth(newChartWidth > MAX_CHART_WIDTH ? MAX_CHART_WIDTH : newChartWidth);
      }
    };

    window.addEventListener('resize', resizeHandler);

    return (): void => {
      if (loadingIdRef.current) {
        closeLoading(loadingIdRef.current);
      }

      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ `${classes.root}-table-section section` }>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('affinities.household.title') }
        </Typography>
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
              <KeyboardDatePicker
                autoOk
                format={ getCurrentDateFormat() }
                inputVariant="outlined"
                label={ t('affinities.household.start_date') }
                maxDate={ endDate }
                minDate={ minDate }
                onChange={ (date): void => { setStartDate(new Date(date || '')); } }
                placeholder={ getCurrentDateFormat().toUpperCase() }
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
                readOnly={ false }
                value={ startDate }
                variant="inline"
              />
            </Grid>
            <Grid item>
              <KeyboardDatePicker
                autoOk
                format={ getCurrentDateFormat() }
                inputVariant="outlined"
                label={ t('affinities.household.end_date') }
                minDate={ startDate }
                onChange={ (date): void => { setEndDate(new Date(date || '')); } }
                placeholder={ getCurrentDateFormat().toUpperCase() }
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
                readOnly={ false }
                value={ endDate }
                variant="inline"
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid
          ref={ elementRef }
          className={ classes.chartsSection }
          container
          spacing={ 2 }
        >
          <Grid
            className={ `${classes.chartsSection}-single` }
            item
            xs={ 6 }
          >
            <Typography
              className={ classes.chartSectionTitle }
              variant="h5"
            >
              { t('affinities.household.charts.income.title') }
            </Typography>
            <SunburstWithLegend
              chartWidth={ chartWidth }
              className="chart-block"
              data={ incomeByCategoryData }
              description={ t('affinities.household.charts.income.hint_description') }
              height={ 300 }
              legendLabels={ {
                0: t('subscription.category')
              } }
              lightColors
              maxDeep={ incomeByCategoryData.maxDeep }
              title={ t('common.details') }
            />
          </Grid>
          <Grid
            className={ `${classes.chartsSection}-single` }
            item
            xs={ 6 }
          >
            <Typography
              className={ classes.chartSectionTitle }
              variant="h5"
            >
              { t('affinities.household.charts.expenses.title') }
            </Typography>
            <SunburstWithLegend
              chartWidth={ chartWidth }
              className="chart-block"
              data={ expensesByCategoryData }
              description={ t('affinities.household.charts.expenses.hint_description') }
              height={ 300 }
              legendLabels={ {
                0: t('subscription.category')
              } }
              lightColors
              maxDeep={ expensesByCategoryData.maxDeep }
              title={ t('common.details') }
            />
          </Grid>
        </Grid>
      </div>
      <div className={ `${classes.root}-table-section section` }>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('affinities.title') }
        </Typography>
        <TableContainer
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  align="right"
                  style={ { width: 63 } }
                >
                  { t('affinities.table.columns.rank') }
                </TableCell>
                <TableCell style={ { width: '50%', paddingLeft: 220 } }>
                  { t('affinities.table.columns.category') }
                </TableCell>
                <TableCell align="right">
                  { t('affinities.table.columns.value') }
                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('affinities.no_data') }
              empty={ !affinities.length }
              hasPagination={ !!pagination?.pageCount }
              loading={ isLoading }
            >
              { affinities.map((affinity, index) => (
                <Row
                  key={ index }
                  affinity={ affinity.affinity }
                  descriptionClass={ affinity.descriptionClass }
                  index={ ((pagination?.page || 1) - 1) * 10 + index + 1 }
                  tree={ affinity.tree }
                />
              )) }
            </CustomTableBody>
          </Table>
          {
            pagination && pagination.pageCount > 1 && (
              <PaginationEl
                color="primary"
                count={ pagination.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
    </div>
  );
};

export default Affinities;
