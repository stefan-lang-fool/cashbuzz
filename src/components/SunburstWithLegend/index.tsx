/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Paper,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import htmlParser from 'html-react-parser';
import deepClone from 'lodash.clonedeep';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sunburst } from 'react-vis';

import styles from './styles';
import { LightenColor } from '@/utils/colors';
import { to6391Format } from '@/utils/languages';
import { getKeyPath, updateData } from '@/utils/sunburstChart';

interface Props {
  chartWidth: number;
  data: any;
  description: string;
  legendLabels: { [key: number]: string };
  title: string;
  className?: string;
  height?: number;
  lightColors?: boolean;
  maxDeep?: number;
}

const MAX_COLOR_OPACITY = 60;

const SunburstWithLegend = ({
  chartWidth,
  data,
  description,
  legendLabels,
  title,
  className = '',
  height = 300,
  lightColors = false,
  maxDeep
}: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n } = useTranslation();

  const [info, setInfo] = useState<{ currency: string; title: string; value: string }>();
  const [chartData, setChartData] = useState(data);

  const totalAmount = useMemo(() => {
    const sum = data.children.reduce((previous: number, current: any) => previous + current.amount_total, 0);
    return data.children?.length ? new Intl.NumberFormat(to6391Format(i18n.language), { style: 'currency', currency: 'EUR' }).format(sum) : '';
  }, [data, i18n.language]);

  const fillBlankDataSpace = useCallback((localData: any) => {
    if (!localData.children?.length) {
      return localData;
    }

    const tempChildren = localData.children;
    const childrenSum = tempChildren.reduce((previous: number, current: any) => Number((previous + (current.amount_total || 0)).toFixed(2)), 0);

    if (localData.amount_total && localData.amount_total !== childrenSum) {
      localData.children.push({
        amount_total: localData.amount_total - childrenSum,
        class: localData.class,
        currency: localData.currency,
        id: localData.id + 1000,
        name: t('common.other'),
        nonInteractive: true,
        value: localData.amount_total - childrenSum
      });
    }

    tempChildren.forEach((singleChartPart: any) => {
      if (singleChartPart.children?.length) {
        fillBlankDataSpace(singleChartPart);
      }
    });


    return localData;
  }, [t]);

  useEffect(() => {
    setChartData(fillBlankDataSpace(deepClone(data)));
  }, [data, fillBlankDataSpace]);

  return (
    <Paper className={ classNames([classes.root, className]) }>
      <div className={ classes.chart }>
        <Sunburst
          animation
          className="sunburst-chart"
          data={ chartData }
          getColor={ (d: any): string => {
            if (d.nonInteractive) {
              return 'rgba(255,255,255,000.1)';
            }

            if (!lightColors) {
              return d.hex;
            }

            let mod = 100;

            if (maxDeep) {
              mod = 100 - (100 - MAX_COLOR_OPACITY) / maxDeep * d.depth - 1;
            } else {
              mod = MAX_COLOR_OPACITY * (d.depth > 1 ? 1 : 0);
            }

            return LightenColor(d.hex, mod || 100);
          } }
          getSize={ (d: any): number => d.value }
          height={ height }
          hideRootNode
          onValueMouseOut={ (): void => {
            setInfo(undefined);
            setChartData(updateData(chartData, false));
          } }
          onValueMouseOver={ (chartPart): void => {
            if (chartPart) {
              if (chartPart.nonInteractive) {
                return;
              }
              const path = getKeyPath(chartPart).reverse();
              const pathAsMap = path.reduce((res: any, row: any) => {
                res[row] = true;
                return res;
              }, {});

              let currency = 'EUR';
              if (chartPart.depth > 1) {
                currency = chartPart.currency;
              }

              setInfo({
                currency,
                title: `<strong>${legendLabels[chartPart.depth - 1] || legendLabels[0]}:</strong> ${chartPart.name}`,
                value: `<strong>${t('subscription.total_amount')}:</strong> ${new Intl.NumberFormat(to6391Format(i18n.language), { style: 'currency', currency }).format(chartPart.amount_total)}`
              });
              setChartData(updateData(chartData, pathAsMap));
            }
          } }
          style={ {
            stroke: '#fff',
            strokeOpacity: 1,
            strokeWidth: '2'
          } }
          width={ chartWidth }
        />
        <div className={ classes.summarize }>
          { totalAmount }
        </div>
      </div>
      <div className={ `${classes.info} sunburst-chart-info` }>
        <Typography
          align="left"
          className={ `${classes.info}-title sunburst-chart-info-title` }
          variant="h5"
        >
          { title }
        </Typography>
        <p>{ description }</p>
        <div className={ `${classes.info}-wrapper sunburst-chart-info-title` }>
          <Typography
            className={ `${classes.info}-name` }
            variant="subtitle1"
          >
            { info?.title ? htmlParser(info.title) : '' }
          </Typography>
          <Typography
            className={ `${classes.info}-value` }
            variant="subtitle1"
          >
            { info?.value ? htmlParser(info.value) : '' }
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default SunburstWithLegend;
