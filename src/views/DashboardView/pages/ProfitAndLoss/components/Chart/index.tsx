import {
  Typography
} from '@material-ui/core';
import {
  format,
  parse
} from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useMemo, useState } from 'react';
import { getI18n } from 'react-i18next';
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';

import styles from './styles';
import { getTicks } from '@/utils/charts';
import { getName } from '@/utils/financialGroups';
import { to6391Format, getCurrentLanguage } from '@/utils/languages';

export interface SingleFinanceGroupChartData {
  color: string;
  label: string;
  value: number;
}

interface Props {
  expenses: SingleFinanceGroupChartData[];
  incomes: SingleFinanceGroupChartData[];
  month: string;
  tickValues: { min: number; max: number };
}

const Chart = ({ expenses, incomes, month, tickValues }: Props): JSX.Element => {
  const classes = styles();
  const i18nInstance = getI18n();

  const [chartHintValue, setChartHintValue] = useState<{
    x: number | string | Date;
    y: number | string | Date;
    type: string;
    value: number;
  }>();

  const ticks = useMemo(() => getTicks(tickValues.min, tickValues.max), [tickValues]);

  return (
    <XYPlot
      height={ 150 }
      margin={ { left: 0, top: 10, bottom: 10, right: 0 } }
      onMouseLeave={ (): void => { setChartHintValue(undefined); } }
      stackBy="y"
      width={ 148 }
      xType="ordinal"
      yDomain={ [tickValues.min, tickValues.max] }
    >
      <HorizontalGridLines tickValues={ ticks } />
      <XAxis style={ { display: 'none' } } />
      <YAxis
        style={ { display: 'none' } }
        tickValues={ ticks }
      />
      {
        Object.entries(incomes).map(([key, value]) => (
          <VerticalBarSeries
            key={ key }
            barWidth={ 0.3 }
            cluster="incomes"
            color={ value.color }
            data={
              [
                {
                  label: value.label,
                  x: format(parse(month, 'yyyy-MM', new Date()), 'MMMM', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale }),
                  y: value.value < 0 ? value.value * -1 : value.value
                }
              ]
            }
            onValueMouseOver={ (chartValue): void => {
              setChartHintValue({
                x: chartValue.x,
                y: chartValue.y,
                type: chartValue.label,
                value: chartValue.y0 ? chartValue.y - chartValue.y0 : chartValue.y
              });
            } }
          />
        ))
      }
      {
        Object.entries(expenses).map(([key, value]) => (
          <VerticalBarSeries
            key={ key }
            barWidth={ 0.3 }
            cluster="expenses"
            color={ value.color }
            data={
              [
                {
                  label: value.label,
                  x: format(parse(month, 'yyyy-MM', new Date()), 'MMMM', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale }),
                  y: value.value < 0 ? value.value * -1 : value.value
                }
              ]
            }
            onValueMouseOver={ (chartValue): void => {
              setChartHintValue({
                x: chartValue.x,
                y: chartValue.y,
                type: chartValue.label,
                value: chartValue.y0 ? chartValue.y - chartValue.y0 : chartValue.y
              });
            } }
          />
        ))
      }
      {
        chartHintValue && (
          <Hint
            align={ { horizontal: 'left', vertical: 'auto' } }
            value={ chartHintValue }
          >
            <div className={ classes.hint }>
              <Typography variant="subtitle2">
                { getName(chartHintValue.type) }
              </Typography>
              <Typography variant="subtitle2">
                { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(Number(chartHintValue.value)) }
              </Typography>
            </div>
          </Hint>
        )
      }
    </XYPlot>
  );
};

export default Chart;
