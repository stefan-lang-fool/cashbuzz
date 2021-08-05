/* eslint-disable no-loop-func */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useTheme } from '@material-ui/core';
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import classNames from 'classnames';
import distinctColors from 'distinct-colors';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Row, { SingleSubscription } from './Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import SunburstWithLegend from '@/components/SunburstWithLegend';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION } from '@/constants';
import { Pagination, Organization, Subscription } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { chunk } from '@/utils/arrays';
import { useMobile } from '@/utils/hooks';
import { getCurrentLanguage } from '@/utils/languages';

const MAX_CHART_PARTS = 5;
const MAX_CHART_WIDTH = 250;

const CLASS_FILTER_ARRAY = ['trr', 'brb', 'brc', 'brx', 'brd', 'prf'];

interface Props {
  className?: string;
  onSelect?: (subscription: Subscription) => void | Promise<void>;
}

const ListView = ({ className = '', onSelect = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const theme = useTheme();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [activePage, setActivePage] = useState(1);
  const [chartWidth, setChartWitdth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionList, setSubscriptionList] = useState<SingleSubscription[]>([]);
  const [subscriptionListPagination, setSubscriptionListPagination] = useState<Pagination>();

  const [expensesByEvaluationData, setExpensesByEvaluationData] = useState<any>({ children: [], maxDeep: 0 });
  const [expensesByExpensesTypeData, setExpensesByExpensesTypeData] = useState<any>({ children: [], maxDeep: 0 });
  const [expensesBySourceData, setExpensesBySourceData] = useState<any>({ children: [] });

  const isInitRef = useRef(true);
  const loadingIdRef = useRef<null|number>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  const fetchSubscriptions = useCallback(async (page: number, offLoading = false): Promise<void> => {
    setIsLoading(true);
    const resultData: SingleSubscription[] = [];
    const { data } = await APIService.subscriptions.getAll(false, page);

    const missingOrgs: string[] = Array.from(new Set(data.subscriptions.map((singleSubscription) => singleSubscription.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
    if (missingOrgs.length) {
      const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

      missingOrgsData.forEach((singleOrganization) => {
        organizationsHelper.current[singleOrganization.id] = singleOrganization;
      });
    }

    for (const subscription of data.subscriptions) {
      if (CLASS_FILTER_ARRAY.includes(subscription.class)) {
        continue;
      }

      const industry = cashbuzzQClasses.find((qclass) => qclass.label === subscription.qorg);

      resultData.push({
        industry,
        organization: subscription.org_id ? organizationsHelper.current[subscription.org_id] : undefined,
        subscription
      });
    }
    setSubscriptionList(resultData);
    setSubscriptionListPagination(data.paging);

    if (offLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses]);

  const fetchChartData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const subscriptions = await APIService.subscriptions.getChartData(false);
    let helpIndex = 0;

    const tempExpensesBySourceData: { children: any[]; maxDeep: number } = { children: [], maxDeep: 0 };
    const tempExpensesByExpensesTypeData: { children: any[]; maxDeep: number } = { children: [], maxDeep: 0 };
    const tempExpensesByEvaluationData: { children: any[] } = {
      children: [
        {
          amount_total: 0,
          children: [],
          hex: theme.palette.success.main,
          id: helpIndex++,
          key: 'green',
          name: t('expenses.evaluation_values.green')
        },
        {
          amount_total: 0,
          children: [],
          hex: theme.custom.colors.accent,
          id: helpIndex++,
          key: 'yellow',
          name: t('expenses.evaluation_values.yellow')
        },
        {
          amount_total: 0,
          children: [],
          hex: theme.palette.error.main,
          id: helpIndex++,
          key: 'red',
          name: t('expenses.evaluation_values.red')
        },
        {
          amount_total: 0,
          children: [],
          hex: '#000',
          id: helpIndex++,
          key: 'black',
          name: t('expenses.evaluation_values.black')
        },
        {
          amount_total: 0,
          children: [],
          hex: theme.custom.colors.neutral,
          id: helpIndex++,
          key: 'white',
          name: t('expenses.evaluation_values.white')
        }
      ]
    };

    const currentLanguage = getCurrentLanguage();

    const missingOrgs: string[] = Array.from(new Set(subscriptions.map((singleSubscription) => singleSubscription.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
    if (missingOrgs.length) {
      const chunkedMissingOrgs = chunk<string>(missingOrgs, 250);

      for (const singleChunk of chunkedMissingOrgs) {
        const { data: missingOrgsData } = await APIService.description.getOrganizations(singleChunk);

        missingOrgsData.forEach((singleOrganization) => {
          organizationsHelper.current[singleOrganization.id] = singleOrganization;
        });
      }
    }

    for (const subscription of subscriptions) {
      if (CLASS_FILTER_ARRAY.includes(subscription.class)) {
        continue;
      }

      const tempOrganization = subscription.org_id ? organizationsHelper.current[subscription.org_id] : undefined;
      const tempClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === subscription.qorg);
      const tempClassTree = tempClass?.category_path.split('#').filter((singleClass) => !CATEGORIZATION.MEANINGLESS_CLASSES.includes(singleClass));
      const data = tempClass?.category_path.split('#').filter((singleClass) => singleClass === 'orga')

      const expensesClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === subscription.qaction);
      const expensesClassTree = expensesClass?.category_path.split('#').filter((singleClass) => !CATEGORIZATION.MEANINGLESS_CLASSES.includes(singleClass));

      const roundedAmount = Number(subscription.amount_total.toFixed(2));

      // EXPENSES BY EXPENSES TYPE CHART DATA
      if (expensesClassTree && expensesClass) {
        if (tempExpensesByExpensesTypeData.maxDeep < expensesClassTree.length) {
          tempExpensesByExpensesTypeData.maxDeep = expensesClassTree.length;
        }

        let chartPart: any = tempExpensesByExpensesTypeData;

        expensesClassTree.forEach((singleClass) => {
          const tempTreeClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === singleClass);
          const tempChartPart = chartPart.children?.find((singleChartPart: any) => singleChartPart.class === singleClass);

          if (!tempTreeClass) {
            return;
          }

          if (tempChartPart) {
            tempChartPart.amount_total = Number((tempChartPart.amount_total + roundedAmount).toFixed(2));

            if (tempChartPart.value) {
              tempChartPart.value = Number((tempChartPart.value + roundedAmount).toFixed(2));
            }
            chartPart = tempChartPart;
          } else {
            const newChartPart = {
              amount_total: subscription.amount_total,
              class: singleClass,
              currency: subscription.currency,
              id: helpIndex++,
              name: currentLanguage === 'en' ? tempTreeClass.label_en : tempTreeClass.label_de,
              value: subscription.amount_total
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

      // EXPENSES BY SOURCE CHART DATA
      if (tempClass && tempClassTree) {
        if (tempExpensesBySourceData.maxDeep < tempClassTree.length) {
          tempExpensesBySourceData.maxDeep = tempClassTree.length;
        }

        let chartPart: any = tempExpensesBySourceData;

        tempClassTree.forEach((singleClass) => {
          const tempTreeClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === singleClass);
          const tempChartPart = chartPart.children?.find((singleChartPart: any) => singleChartPart.class === singleClass);

          if (!tempTreeClass) {
            return;
          }

          if (tempChartPart) {
            tempChartPart.amount_total = Number((tempChartPart.amount_total + roundedAmount).toFixed(2));

            if (tempChartPart.value) {
              tempChartPart.value = Number((tempChartPart.value + roundedAmount).toFixed(2));
            }
            chartPart = tempChartPart;
          } else {
            const newChartPart = {
              amount_total: subscription.amount_total,
              class: singleClass,
              currency: subscription.currency,
              id: helpIndex++,
              name: currentLanguage === 'en' ? tempTreeClass.label_en : tempTreeClass.label_de,
              value: subscription.amount_total
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
        })
        data?.forEach((singleClass) => {
          const tempTreeClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === singleClass);
          const tempChartPart = chartPart.children?.find((singleChartPart: any) => singleChartPart.class === singleClass);

          if (!tempTreeClass) {
            return;
          }

          if (tempChartPart) {
            tempChartPart.amount_total = Number((tempChartPart.amount_total + roundedAmount).toFixed(2));

            if (tempChartPart.value) {
              tempChartPart.value = Number((tempChartPart.value + roundedAmount).toFixed(2));
            }
            chartPart = tempChartPart;
          } else {
            const newChartPart = {
              amount_total: subscription.amount_total,
              class: singleClass,
              currency: subscription.currency,
              id: helpIndex++,
              name: currentLanguage === 'en' ? tempTreeClass.label_en : tempTreeClass.label_de,
              value: subscription.amount_total
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
        })
      }

      // SUPPLIER EVALUTATION CHART DATA
      const chartPart = tempExpensesByEvaluationData.children.find((tempChartPart) => tempChartPart.key === tempOrganization?.rating_color);

      if (chartPart) {
        const sameOrgElement = chartPart.children.find((tempElement: any) => tempElement.name === tempOrganization?.name);
        let hex = '#000';

        switch (tempOrganization?.rating_color) {
          case 'black':
            hex = '#000';
            break;
          case 'green': {
            hex = theme.palette.success.main;
            break;
          }
          case 'red': {
            hex = theme.palette.error.main;
            break;
          }
          case 'white': {
            hex = theme.custom.colors.neutral;
            break;
          }
          case 'yellow': {
            hex = theme.custom.colors.accent;
            break;
          }
          default:
        }

        chartPart.amount_total = Number((chartPart.amount_total + roundedAmount).toFixed(2));

        if (sameOrgElement) {
          sameOrgElement.amount_total = Number((sameOrgElement.amount_total + roundedAmount).toFixed(2));
          sameOrgElement.value = Number((sameOrgElement.value + roundedAmount).toFixed(2));
        } else {
          chartPart.children.push({
            amount_total: subscription.amount_total,
            currency: subscription.currency,
            id: helpIndex++,
            hex,
            name: tempOrganization?.name,
            value: subscription.amount_total
          });
        }
      }
    }

    // GROPING INNER RING
    if (tempExpensesBySourceData.children.length > MAX_CHART_PARTS) {
      tempExpensesBySourceData.children = tempExpensesBySourceData.children
        .sort((a, b) => a.amount_total - b.amount_total)
        .reduce((previous, currentValue, currentIndex) => {
          if (currentIndex < MAX_CHART_PARTS) {
            previous.push(currentValue);
          } else if (currentIndex === MAX_CHART_PARTS) {
            previous.push({
              amount_total: currentValue.amount_total,
              children: currentValue.children,
              class: 'other',
              id: currentValue.id,
              name: t('common.other')
            });
          } else {
            previous[MAX_CHART_PARTS].amount_total = Number((previous[MAX_CHART_PARTS].amount_total + currentValue.amount_total).toFixed(2));
            previous[MAX_CHART_PARTS].children = previous[MAX_CHART_PARTS].children.concat(currentValue.children);
          }

          return previous;
        }, []);
    }

    // GROPING OUTER RING
    tempExpensesBySourceData.children.forEach((chartPart) => {
      if (chartPart.children.length > MAX_CHART_PARTS) {
        chartPart.children = chartPart.children
          .sort((a: any, b: any) => a.amount_total - b.amount_total)
          .reduce((previous: any, currentValue: any, currentIndex: number) => {
            if (currentIndex < MAX_CHART_PARTS) {
              previous.push(currentValue);
            } else if (currentIndex === MAX_CHART_PARTS) {
              previous.push({
                amount_total: currentValue.amount_total,
                class: 'other',
                currency: currentValue.currency,
                id: currentValue.id,
                name: t('common.other'),
                value: currentValue.value
              });
            } else {
              previous[MAX_CHART_PARTS].amount_total = Number((previous[MAX_CHART_PARTS].amount_total + currentValue.amount_total).toFixed(2));
              previous[MAX_CHART_PARTS].value = Number((previous[MAX_CHART_PARTS].value + currentValue.amount_total).toFixed(2));
            }

            return previous;
          }, []);
      }
    });

    tempExpensesByEvaluationData.children.forEach((chartPart) => {
      if (chartPart.children.length > MAX_CHART_PARTS) {
        chartPart.children = chartPart.children
          .sort((a: any, b: any) => a.amount_total - b.amount_total)
          .reduce((previous: any, currentValue: any, currentIndex: number) => {
            if (currentIndex < MAX_CHART_PARTS) {
              previous.push(currentValue);
            } else if (currentIndex === MAX_CHART_PARTS) {
              previous.push({
                amount_total: currentValue.amount_total,
                class: 'other',
                hex: currentValue.hex,
                currency: currentValue.currency,
                id: currentValue.id,
                name: t('common.other'),
                value: currentValue.value
              });
            } else {
              previous[MAX_CHART_PARTS].amount_total = Number((previous[MAX_CHART_PARTS].amount_total + currentValue.amount_total).toFixed(2));
              previous[MAX_CHART_PARTS].value = Number((previous[MAX_CHART_PARTS].value + currentValue.amount_total).toFixed(2));
            }

            return previous;
          }, []);
      }
    });

    const colorsBySource = distinctColors({
      count: tempExpensesBySourceData.children.length
    });

    const colorsByExpensesType = distinctColors({
      count: tempExpensesByExpensesTypeData.children.length
    });

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

    tempExpensesByExpensesTypeData.children.forEach((tempData, index) => {
      const color = colorsByExpensesType[index].hex();
      tempData.hex = color;

      if (tempData.children) {
        tempData.children.forEach((tempDataChild: any) => {
          propagateColor(tempDataChild, color);
        });
      }
    });

    tempExpensesBySourceData.children.forEach((tempData, index) => {
      const color = colorsBySource[index].hex();
      tempData.hex = color;

      if (tempData.children) {
        tempData.children.forEach((tempDataChild: any) => {
          propagateColor(tempDataChild, color);
        });
      }
    });

    setExpensesByEvaluationData(tempExpensesByEvaluationData);
    setExpensesByExpensesTypeData(tempExpensesByExpensesTypeData);
    console.log("tempExpensesByExpensesTypeData =>",tempExpensesByExpensesTypeData);
    console.log("tempExpensesBySourceData =>",tempExpensesBySourceData);
    setExpensesBySourceData(tempExpensesBySourceData);
  }, [cashbuzzQClasses, t, theme]);

  useEffect(() => {
    if (elementRef.current) {
      const multiplier = window.innerWidth > 780 ? 2 : 1;
      const newChartWidth = elementRef.current.offsetWidth / multiplier - 40;

      setChartWitdth(newChartWidth > MAX_CHART_WIDTH ? MAX_CHART_WIDTH : newChartWidth);
    }

    const fetchAll = async (): Promise<void> => {
      setIsLoading(true);

      try {
        await fetchSubscriptions(1);
        await fetchChartData();
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
        isInitRef.current = false;
      }
    };

    fetchAll();

    const resizeHandler = (): void => {
      if (elementRef.current) {
        const multiplier = window.innerWidth > 780 ? 2 : 1;
        const newChartWidth = elementRef.current.offsetWidth / multiplier - 40;

        setChartWitdth(newChartWidth > MAX_CHART_WIDTH ? MAX_CHART_WIDTH : newChartWidth);
      }
    };

    window.addEventListener('resize', resizeHandler);

    return (): void => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [fetchChartData, fetchSubscriptions, t]);

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
    if (!isInitRef.current) {
      fetchSubscriptions(activePage, true);
    }
  }, [activePage, fetchSubscriptions]);

  return (
    <div
      ref={ elementRef }
      className={ classNames({
        [classes.root]: true,
        [className]: true
      }) }
    >
      <Grid
        className={ `${classes.root}-charts` }
        container
        spacing={ 2 }
      >
        <Grid
          className={ `${classes.root}-charts-single` }
          item
          xs={ 6 }
        >
          <Typography
            className="section-title"
            variant="h4"
          >
            { t('expenses.general.charts.expenses_by_source') }
          </Typography>
          <SunburstWithLegend
            chartWidth={ chartWidth }
            className="chart-block"
            data={ expensesBySourceData }
            description={ t('expenses.general.charts.hint_description') }
            height={ 300 }
            legendLabels={ {
              0: t('subscription.industry'),
              1: t('subscription.name')
            } }
            maxDeep={expensesBySourceData.maxDeep}
            lightColors
            title={ t('common.details') }
          />
        </Grid>
        <Grid
          className={ `${classes.root}-charts-single` }
          item
          xs={ 6 }
        >
          <Typography
            className="section-title"
            variant="h4"
          >
            { t('expenses.general.charts.expenses_by_expenses_type') }
          </Typography>
          <SunburstWithLegend
            chartWidth={ chartWidth }
            className="chart-block"
            data={ expensesByExpensesTypeData }
            description={ t('expenses.general.charts.hint_description') }
            height={ 300 }
            legendLabels={ {
              0: t('common.type')
            } }
            maxDeep={expensesByExpensesTypeData.maxDeep}
            lightColors
            title={ t('common.details') }
          />
        </Grid>
      </Grid>
      <div className={ `${classes.root}-table` }>
        <TableContainer
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={ { width: 63 } } />
                <TableCell>
                  { t('subscription.name') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell>
                      { t('subscription.industry') }
                    </TableCell>
                  )
                }
                <TableCell align="right">
                  { t('subscription.total_amount') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell>
                      { t('subscription.period') }
                    </TableCell>
                  )
                }
                {
                  !isMobile && (
                    <TableCell align="right">
                      { t('subscription.number_of_transactions') }
                    </TableCell>
                  )
                }
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('expenses.general.table.no_data') }
              empty={ !subscriptionList.length }
              hasPagination={ !!subscriptionListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                subscriptionList.map((subscription) => (
                  <Row
                    key={ subscription.subscription.id }
                    industry={ subscription.industry }
                    isMobile={ isMobile }
                    onSelect={ onSelect }
                    organization={ subscription.organization }
                    subscription={ subscription.subscription }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            subscriptionListPagination && subscriptionListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ subscriptionListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
    </div>
  );
};

export default ListView;
