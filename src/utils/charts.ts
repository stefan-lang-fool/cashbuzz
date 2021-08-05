import {
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  isAfter,
  isSameDay,
  isWithinInterval,
  parseISO,
  subMilliseconds
} from 'date-fns';
import { Account, LiquidityChartData, LiquidityPeriod, Transaction } from '@/interfaces';

export const getTicks = (minValue: number, maxValue: number): number[] => {
  const difference = maxValue - minValue;
  const tick = Math.round(difference / 500) * 100;

  const resultArray: number[] = [];

  const startValue = minValue === 0 ? minValue : minValue - tick;

  for (let i = startValue; i <= maxValue; i += tick) {
    resultArray.push(i);
  }

  resultArray.push(Math.ceil(maxValue / tick) * tick);

  return resultArray;
};

export type LIQUIDITY_CHART_INTERVAL = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'every-six-months' | 'yearly';

export const getLiquidityData = (transactions: Transaction[], startDate: Date, endDate: Date, accounts: Account[]): LiquidityChartData => {
  const intervalInfo = getLiquidityTimeInterval(startDate, endDate);
  const resultArray: LiquidityPeriod[] = intervalInfo.interval.map((singleInterval) => ({
    balance: 0,
    start: singleInterval.start,
    end: singleInterval.end,
    income: 0,
    expenses: 0,
    predicted: false
  }));

  if (!accounts.length) {
    return { data: resultArray, max: 0, min: 0 };
  }

  // TODO: This logic could break if accounts will have different last successful update date (different period)
  // eslint-disable-next-line no-undef-init
  const newestLastSyncedDate = accounts.reduce<Date>((previousResult, currentResult) => {
    const currentDate = parseISO(currentResult.last_synced);

    if (currentDate > previousResult) {
      return currentDate;
    }
    return previousResult;
  }, parseISO(accounts[0].last_synced));

  const currentBalanceIndex = resultArray.findIndex((singlePeriod) => isWithinInterval(newestLastSyncedDate, {
    start: singlePeriod.start,
    end: singlePeriod.end
  }));

  let afterOrSameSyncBalance = 0;
  let beforeSyncBalance = 0;

  resultArray.forEach((period, periodIndex) => {
    transactions.forEach((transactionData) => {
      const transactionDate = parseISO(transactionData.valueDate);
      if (isWithinInterval(transactionDate, { start: period.start, end: period.end })) {
        if (periodIndex === currentBalanceIndex) {
          if (isSameDay(transactionDate, newestLastSyncedDate) || isAfter(transactionDate, newestLastSyncedDate)) {
            afterOrSameSyncBalance += transactionData.amount;
          } else {
            beforeSyncBalance += transactionData.amount;
          }
        } else if (transactionData.amount > 0) {
          period.income += transactionData.amount;
        } else {
          period.expenses += transactionData.amount;
        }

        if (!period.predicted && transactionData.predicted) {
          period.predicted = true;
        }
      }
    });
  });

  if (currentBalanceIndex > -1) {
    accounts.forEach((singleAccount) => {
      resultArray[currentBalanceIndex].balance += singleAccount.balance || 0;
    });

    for (let i = currentBalanceIndex - 1; i >= 0; i -= 1) {
      const currentBalance = resultArray[i].income + resultArray[i].expenses;

      if (i === currentBalanceIndex - 1) {
        resultArray[i].balance = resultArray[i + 1].balance - beforeSyncBalance - currentBalance;
      } else {
        resultArray[i].balance = resultArray[i + 1].balance - currentBalance;
      }
    }

    for (let i = currentBalanceIndex + 1; i < resultArray.length; i += 1) {
      const currentBalance = resultArray[i].income + resultArray[i].expenses;

      if (i === currentBalanceIndex + 1) {
        resultArray[i].balance = resultArray[i - 1].balance + afterOrSameSyncBalance + currentBalance;
      } else {
        resultArray[i].balance = resultArray[i - 1].balance + currentBalance;
      }
    }

    resultArray[currentBalanceIndex].balance += afterOrSameSyncBalance;
  }

  let maxValue = 0;
  let minValue = 0;

  resultArray.forEach((period) => {
    if (period.income > maxValue) {
      maxValue = period.income;
    }

    if (period.balance > maxValue) {
      maxValue = period.balance;
    }

    if (period.expenses < minValue) {
      minValue = period.expenses;
    }

    if (period.balance < minValue) {
      minValue = period.balance;
    }
  });

  return { data: resultArray, max: maxValue, min: minValue };
};

export const getLiquidityTimeInterval = (start: Date, end: Date): { interval: { start: Date; end: Date }[]; type: LIQUIDITY_CHART_INTERVAL } => {
  const maxPoints = window.innerWidth / 40;
  let interval: { start: Date; end: Date }[] = eachWeekOfInterval({ end, start }, { weekStartsOn: 1 }).map((singleDate, index, array) => ({
    start: singleDate,
    end: array[index + 1] ? subMilliseconds(array[index + 1], 1) : subMilliseconds(addWeeks(singleDate, 1), 1)
  }));

  // Weekly
  if (interval.length <= maxPoints) {
    return {
      interval,
      type: 'weekly'
    };
  }

  // Bi-weekly
  if (interval.length / 2 <= maxPoints) {
    return {
      interval: interval
        .filter((_, index) => index % 2 === 0)
        .map((currentInterval) => ({
          ...currentInterval,
          end: addWeeks(currentInterval.end, 1)
        })),
      type: 'bi-weekly'
    };
  }

  // Monthly
  interval = eachMonthOfInterval({ end, start }).map((singleDate, index, array) => ({
    start: singleDate,
    end: array[index + 1] ? subMilliseconds(array[index + 1], 1) : subMilliseconds(addMonths(singleDate, 1), 1)
  }));
  if (interval.length < maxPoints) {
    return {
      interval,
      type: 'monthly'
    };
  }

  // Quarterly
  interval = eachQuarterOfInterval({ end, start }).map((singleDate, index, array) => ({
    start: singleDate,
    end: array[index + 1] ? subMilliseconds(array[index + 1], 1) : subMilliseconds(addQuarters(singleDate, 1), 1)
  }));
  if (interval.length < maxPoints) {
    return {
      interval,
      type: 'quarterly'
    };
  }

  // Every six months
  interval = eachMonthOfInterval({ end, start }).map((singleDate, index, array) => ({
    start: singleDate,
    end: array[index + 1] ? subMilliseconds(array[index + 1], 1) : subMilliseconds(addMonths(singleDate, 1), 1)
  }));
  if (interval.length / 6 <= maxPoints) {
    return {
      interval: interval.filter((_, index) => index % 6 === 0),
      type: 'every-six-months'
    };
  }

  return {
    interval: eachYearOfInterval({ end, start }).map((singleDate, index, array) => ({
      start: singleDate,
      end: array[index + 1] ? subMilliseconds(array[index + 1], 1) : subMilliseconds(addYears(singleDate, 1), 1)
    })),
    type: 'yearly'
  };
};
