/* eslint-disable no-restricted-globals */
import { Typography, useTheme } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Card from './components/Card';
import FinancialGroupChart from './components/FinancialGroupChart';
import styles from './styles';
import { KPI } from '@/constants';
import { Account, FinanceGroup } from '@/interfaces';
import { getTicks } from '@/utils/charts';
import { getName } from '@/utils/financialGroups';

interface Props {
  accounts: Account[];
  financeGroupsChartData: {
    incomes: {
      label: string;
      list: FinanceGroup[];
    }[];
    expenses: {
      label: string;
      list: FinanceGroup[];
    }[];
  } | undefined;
  financeGroupsChartFutureData: {
    incomes: {
      label: string;
      list: FinanceGroup[];
    }[];
    expenses: {
      label: string;
      list: FinanceGroup[];
    }[];
  } | undefined;
}

const KPICards = ({ accounts, financeGroupsChartData, financeGroupsChartFutureData }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const theme = useTheme();

  const KPIFromLocalStorage = localStorage.getItem(KPI.NAME);
  const activeKPICards: Record<string, 'on' | 'off'> = JSON.parse(KPIFromLocalStorage === null ? '{}' : KPIFromLocalStorage);

  const summarizedCosts = useMemo(() => {
    const list = [...(financeGroupsChartData?.expenses.map((singleData) => singleData.list) || [])].flat();
    const futureList = [...(financeGroupsChartFutureData?.expenses.map((singleData) => singleData.list) || [])].flat();

    const costs = list.reduce<FinanceGroup[]>((previous, current) => {
      const el = previous.find((singleEl) => singleEl.month === current.month);

      if (el) {
        el.amount += current.amount;
      } else {
        previous.push({ ...current });
      }

      return previous;
    }, []);

    const futureCosts = futureList.reduce<FinanceGroup[]>((previous, current) => {
      const el = previous.find((singleEl) => singleEl.month === current.month);

      if (el) {
        el.amount += current.amount;
      } else {
        previous.push({ ...current });
      }

      return previous;
    }, []);

    return {
      costs,
      futureCosts
    };
  }, [financeGroupsChartData, financeGroupsChartFutureData]);

  const summarizedIncomes = useMemo(() => {
    const list = [...(financeGroupsChartData?.incomes.map((singleData) => singleData.list) || [])].flat();
    const futureList = [...(financeGroupsChartFutureData?.incomes.map((singleData) => singleData.list) || [])].flat();

    const incomes = list.reduce<FinanceGroup[]>((previous, current) => {
      const el = previous.find((singleEl) => singleEl.month === current.month);

      if (el) {
        el.amount += current.amount;
      } else {
        previous.push({ ...current });
      }

      return previous;
    }, []);

    const futureIncomes = futureList.reduce<FinanceGroup[]>((previous, current) => {
      const el = previous.find((singleEl) => singleEl.month === current.month);

      if (el) {
        el.amount += current.amount;
      } else {
        previous.push({ ...current });
      }

      return previous;
    }, []);

    return {
      incomes,
      futureIncomes
    };
  }, [financeGroupsChartData, financeGroupsChartFutureData]);

  const ticksData = useMemo(() => {
    const max = Math.max(...[
      ...summarizedIncomes.incomes.map((singleData) => singleData.amount),
      ...summarizedIncomes.futureIncomes.map((singleData) => singleData.amount)
    ]);
    const min = Math.min(...[
      ...summarizedCosts.costs.map((singleData) => singleData.amount),
      ...summarizedCosts.futureCosts.map((singleData) => singleData.amount)
    ]);

    return {
      min: 0,
      max: isFinite(max) && isFinite(min) ? Math.max(max, Math.abs(min)) : 0
    };
  }, [summarizedCosts, summarizedIncomes]);

  return (
    <>
      <Typography
        className="section-title"
        variant="h4"
      >
        { t('overview.kpi-cards.title') }
      </Typography>
      { !!accounts.length && financeGroupsChartData && financeGroupsChartFutureData && (
        <div
          className={ `${classes.cardsSection} section` }
          style={ { display: Object.values(activeKPICards).includes('on') ? 'grid' : 'none' } }
        >
          {
            activeKPICards.incomes === 'on' && (
              <Card
                key="incomes"
                mainValue={ summarizedIncomes.futureIncomes[0]?.amount || 0 }
                subValue={ summarizedIncomes.futureIncomes[1]?.amount || 0 }
                title={ t('overview.kpi-cards.income') }
              >
                <FinancialGroupChart
                  color={ theme.palette.success.main }
                  data={ summarizedIncomes.incomes }
                  dataType="income"
                  futureColor={ theme.palette.success.light }
                  futureData={ summarizedIncomes.futureIncomes }
                  ticks={ getTicks(ticksData.min, ticksData.max) }
                />
              </Card>
            )
          }
          {
          financeGroupsChartData?.incomes.map((singleIncome, index) => {
            if (activeKPICards[singleIncome.label] === undefined || activeKPICards[singleIncome.label] === 'off') {
              return null;
            }

            return (
              <Card
                key={ singleIncome.label }
                mainValue={ financeGroupsChartFutureData?.incomes[index].list[0].amount || 0 }
                subValue={ financeGroupsChartFutureData?.incomes[index].list[1].amount || 0 }
                title={ getName(singleIncome.label) || '' }
              >
                <FinancialGroupChart
                  color={ theme.palette.success.main }
                  data={ singleIncome.list || [] }
                  dataType="income"
                  futureColor={ theme.palette.success.light }
                  futureData={ financeGroupsChartFutureData?.incomes[index].list || [] }
                  ticks={ getTicks(ticksData.min, ticksData.max) }
                />
              </Card>
            );
          })
          }
          {
            activeKPICards.expenses === 'on' && (
              <Card
                key="costs"
                mainValue={ summarizedCosts.futureCosts[0]?.amount || 0 }
                subValue={ summarizedCosts.futureCosts[1]?.amount || 0 }
                title={ t('overview.kpi-cards.costs') }
              >
                <FinancialGroupChart
                  color={ theme.palette.error.main }
                  data={ summarizedCosts.costs }
                  dataType="expenses"
                  futureColor={ theme.palette.error.light }
                  futureData={ summarizedCosts.futureCosts }
                  ticks={ getTicks(ticksData.min, ticksData.max) }
                />
              </Card>
            )
          }
          {
          financeGroupsChartData?.expenses.map((singleExpense, index) => {
            if (activeKPICards[singleExpense.label] === undefined || activeKPICards[singleExpense.label] === 'off') {
              return null;
            }

            return (
              <Card
                key={ singleExpense.label }
                mainValue={ financeGroupsChartFutureData?.expenses[index].list[0].amount || 0 }
                subValue={ financeGroupsChartFutureData?.expenses[index].list[1].amount || 0 }
                title={ getName(singleExpense.label) || '' }
              >
                <FinancialGroupChart
                  color={ theme.palette.error.main }
                  data={ singleExpense.list || [] }
                  dataType="expenses"
                  futureColor={ theme.palette.error.light }
                  futureData={ financeGroupsChartFutureData?.expenses[index].list || [] }
                  ticks={ getTicks(ticksData.min, ticksData.max) }
                />
              </Card>
            );
          })
          }
        </div>
      ) }
      <p>{ accounts.length ? t('overview.kpi-cards.description') : t('overview.kpi-cards.no_data_label') }</p>
    </>
  );
};

export default KPICards;
