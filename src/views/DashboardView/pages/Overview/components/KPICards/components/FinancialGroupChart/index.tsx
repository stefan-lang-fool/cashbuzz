/* eslint-disable import/no-duplicates */
import { Typography, useTheme } from '@material-ui/core';
import {
  addMonths,
  isSameMonth,
  format,
  parse,
  startOfMonth,
  subMonths
} from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useCallback, useMemo, useState } from 'react';
import { getI18n } from 'react-i18next';
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';

import styles from './styles';
import { FinanceGroup } from '@/interfaces';
import { to6391Format, getCurrentLanguage } from '@/utils/languages';

interface Props {
  color: string;
  data: FinanceGroup[];
  dataType: 'income' | 'expenses';
  futureColor: string;
  futureData: FinanceGroup[];
  ticks?: number[];
}

const FinancialGroupChartSmall = ({ color, data, dataType, futureColor, futureData, ticks }: Props): JSX.Element => {
  const classes = styles();
  const i18nInstance = getI18n();
  const theme = useTheme();

  const [hintValue, setHintValue] = useState<{ x: number | string | Date; y: number | string | Date }>();

  const maxValue = useMemo(
    () => Math.max(0, ...data.map((singleData) => Math.abs(singleData.amount)), ...futureData.map((singleData) => Math.abs(singleData.amount))),
    [data, futureData]
  );

  const getXTicks = useCallback((value) => {
    const currentValue = new Date(value);

    const maxPastMonth = startOfMonth(subMonths(new Date(), 3));
    const currentMonth = startOfMonth(new Date());
    const maxFutureMonth = startOfMonth(addMonths(new Date(), 3));

    if (isSameMonth(currentValue, maxPastMonth) || isSameMonth(currentValue, currentMonth) || isSameMonth(currentValue, maxFutureMonth)) {
      return format(currentValue, 'MMM, yy', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale });
    }

    return '';
  }, []);

  return (
    <XYPlot
      className={ classes.root }
      height={ 200 }
      margin={ { left: 60, bottom: 60 } }
      onMouseLeave={ (): void => { setHintValue(undefined); } }
      stackBy="y"
      width={ 252 }
      yDomain={ [0, ticks ? ticks[ticks.length - 1] : maxValue + 500] }
    >
      <HorizontalGridLines tickValues={ ticks } />
      <XAxis
        className={ classes.tickLabel }
        tickFormat={ getXTicks }
        tickLabelAngle={ -90 }
        tickTotal={ 40 }
        tickValues={ [...data.map((singleData) => parse(singleData.month, 'yyyy-MM', new Date()).getTime()), ...futureData.map((singleData) => parse(singleData.month, 'yyyy-MM', new Date()).getTime())] }
      />
      <YAxis
        tickFormat={ (value): string => new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', minimumFractionDigits: 0, currency: 'EUR' }).format(Number(value)) }
        tickValues={ ticks }
      />
      <VerticalBarSeries
        barWidth={ 0.6 }
        color={ color }
        data={ data.map((singleData) => ({
          x: parse(singleData.month, 'yyyy-MM', new Date()).getTime(),
          y: dataType === 'expenses' ? singleData.amount * -1 : singleData.amount,
          y0: 0
        })) }
        onValueMouseOver={ (value): void => {
          setHintValue({ x: value.x, y: value.y });
        } }
      />
      <VerticalBarSeries
        barWidth={ 0.6 }
        colorType="literal"
        data={ futureData.map((singleData, index) => ({
          x: parse(singleData.month, 'yyyy-MM', new Date()).getTime(),
          y: dataType === 'expenses' ? singleData.amount * -1 : singleData.amount,
          y0: 0,
          color: index === 0 ? theme.custom.colors.primary : futureColor
        })) }
        onValueMouseOver={ (value): void => {
          setHintValue({ x: value.x, y: value.y });
        } }
      />
      {
        hintValue && (
          <Hint value={ hintValue }>
            <div className={ classes.hint }>
              <Typography variant="subtitle2">
                { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(Math.round(Number(hintValue.y)))) }
              </Typography>
            </div>
          </Hint>
        )
      }
    </XYPlot>
  );
};

export default FinancialGroupChartSmall;
