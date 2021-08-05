import {
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { XYPlot, ArcSeries, LineSeries } from 'react-vis';
import tinyColor from 'tinycolor2';
import styles from './styles';
import { to6391Format } from '@/utils/languages';

export interface SingleData {
  currency?: string;
  label: string;
  value: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ChartPart {
  outer: SingleData;
  inner?: SingleData;
}

interface Props {
  data: ChartPart[];
}

const ANGLE_90 = Math.PI / 2;
const K = Math.sqrt(4 / Math.PI);
const SIZE = 300;

const getColor = (index: number): string => {
  switch (index) {
    case 0:
      return '#0000FF';
    case 1:
      return '#FF0000';
    case 2:
      return '#00FF00';
    default:
      return '#800080';
  }
};


const FlowerChart = ({ data }: Props): JSX.Element => {
  const classes = styles();
  const { i18n: i18nInstance } = useTranslation();

  const [legend, setLegend] = useState<{[key: string]: { label: string; labels?: string[]; value: string }}>({});

  const radiuses = useMemo(() => data.reduce<{ outer: number[]; inner: number[] }>((previous, current) => {
    previous.outer.push(current.outer.value && K * Math.sqrt(current.outer.value));
    previous.inner.push(current.inner && current.inner.value ? K * Math.sqrt(current.inner.value) : 0);

    return previous;
  }, { outer: [], inner: [] }), [data]);
  const sortedRadiuses = useMemo(() => [...radiuses.outer].sort((a, b) => b - a), [radiuses]);

  const maxQuarterSize = useMemo(() => SIZE * sortedRadiuses[0] / (sortedRadiuses[0] + sortedRadiuses[1]), [sortedRadiuses]);
  const chartSize = useMemo(() => SIZE ** 2 / (2 * maxQuarterSize), [maxQuarterSize]);
  const centerModifier = useMemo(() => {
    const maxIndex = radiuses.outer.findIndex((value) => value === sortedRadiuses[0]);

    if (!radiuses.outer[maxIndex]) {
      return {
        x: 0,
        y: 0
      };
    }

    const modifier = {
      x: (maxQuarterSize - SIZE / 2) * chartSize / SIZE,
      y: (maxQuarterSize - SIZE / 2) * chartSize / SIZE
    };

    switch (maxIndex) {
      case 0:
        modifier.x *= -1;
        modifier.y *= -1;
        break;
      case 1:
        modifier.x *= -1;
        break;
      case 2:
        break;
      case 3:
        modifier.y *= -1;
        break;
      default:
        return {
          x: 0,
          y: 0
        };
    }

    return modifier;
  }, [chartSize, maxQuarterSize, radiuses, sortedRadiuses]);

  const sizes = useMemo(
    () => ({
      outer: radiuses.outer.map((singleRadius) => singleRadius && chartSize * singleRadius / (sortedRadiuses[0] + sortedRadiuses[1])),
      inner: radiuses.inner.map((singleRadius) => singleRadius && chartSize * singleRadius / (sortedRadiuses[0] + sortedRadiuses[1]))
    }),
    [chartSize, radiuses, sortedRadiuses]
  );

  const mappedData = useMemo(() => data.map((singleData, index) => ({
    outer: {
      ...singleData.outer,
      index,
      color: getColor(index),
      size: sizes.outer[index]
    },
    inner: singleData.inner && {
      ...singleData.inner,
      index,
      color: tinyColor(getColor(index)).lighten(20)
        .toHexString(),
      size: sizes.inner[index]
    }
  })), [data, sizes]);

  const checkTruncation = useCallback((text: string): boolean => {
    const helperEl = document.createElement('p');
    helperEl.id = 'helper';
    helperEl.className = 'MuiTypography-root MuiTypography-body1';
    helperEl.textContent = text;
    helperEl.style.position = 'fixed';
    helperEl.style.opacity = '0';
    helperEl.style.textOverflow = 'ellipsis';
    helperEl.style.overflow = 'hidden';
    helperEl.style.whiteSpace = 'nowrap';
    helperEl.style.maxWidth = `${SIZE / 2 - 4}px`;

    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.append(helperEl);
      const check = helperEl.scrollWidth > helperEl.clientWidth;

      rootEl.removeChild(helperEl);
      return check;
    }

    return false;
  }, []);

  useEffect(() => {
    setLegend(data.reduce<{ [key: string]: { label: string; labels?: string[]; value: string } }>((previous, current, index) => {
      previous[index] = {
        label: current.outer.value === current.inner?.value ? current.inner.label : current.outer.label,
        labels: current.outer.value === current.inner?.value ? [current.outer.label, current.inner.label] : undefined,
        value: new Intl.NumberFormat(to6391Format(i18nInstance.language), { minimumFractionDigits: 2, style: 'currency', currency: current.outer.currency || 'EUR' }).format(Number(current.outer.value))
      };

      return previous;
    }, {}));
  }, [data, i18nInstance.language]);

  if (data.length !== 4) {
    return <></>;
  }


  return (
    <Paper className={ classes.root }>
      <div className={ `${classes.legend} top` }>
        {
          !!Object.keys(legend).length && [legend['3'], legend['0']]
            .map((singleLegend, index) => (
              <div className={ `${classes.legendElement} ${index % 2 === 0 ? 'left' : 'right'}` }>
                <Tooltip
                  key={ singleLegend.label }
                  open={ checkTruncation(singleLegend.label) ? undefined : false }
                  placement={ index % 2 === 0 ? 'bottom-end' : 'bottom-start' }
                  title={ singleLegend.label }
                >
                  <Typography style={ { fontWeight: 600 } }>
                    { singleLegend.label }
                  </Typography>
                </Tooltip>
                <Tooltip
                  key={ singleLegend.value }
                  open={ checkTruncation(singleLegend.value) ? undefined : false }
                  placement={ index % 2 === 0 ? 'bottom-end' : 'bottom-start' }
                  title={ singleLegend.value }
                >
                  <Typography>
                    { singleLegend.value }
                  </Typography>
                </Tooltip>
              </div>
            ))
        }
      </div>
      <XYPlot
        animation
        className={ classNames({
          [classes.chart]: true,
          end: centerModifier.x < 0
        }) }
        height={ chartSize }
        margin={ 0 }
        width={ chartSize }
        xDomain={ [-(chartSize / 2), chartSize / 2] }
        yDomain={ [-(chartSize / 2), chartSize / 2] }
      >
        <ArcSeries
          center={ centerModifier }
          colorType="literal"
          data={ mappedData.map((singleData, index) => ({
            ...singleData.outer,
            angle0: index * ANGLE_90,
            angle: (index + 1) * ANGLE_90,
            radius0: 0,
            radius: singleData.outer.size
          })) }
          onValueClick={ (chartPart): void => {
            if (chartPart) {
              if (legend[chartPart.index] && legend[chartPart.index].labels) {
                const newLabel = (legend[chartPart.index].labels as string[]).find((singleLabel) => singleLabel !== legend[chartPart.index].label);

                if (newLabel) {
                  setLegend({
                    ...legend,
                    [chartPart.index]: {
                      ...legend[chartPart.index],
                      label: newLabel
                    }
                  });
                }
              } else {
                setLegend({
                  ...legend,
                  [chartPart.index]: {
                    label: chartPart.label,
                    value: new Intl.NumberFormat(to6391Format(i18nInstance.language), { minimumFractionDigits: 2, style: 'currency', currency: chartPart.currency || 'EUR' }).format(Number(chartPart.value))
                  }
                });
              }
            }
          } }
          radiusType="literal"
        />
        <ArcSeries
          animation
          center={ centerModifier }
          colorType="literal"
          data={ mappedData.map((singleData, index) => ({
            ...singleData.inner,
            angle0: index * ANGLE_90,
            angle: (index + 1) * ANGLE_90,
            radius0: 0,
            radius: singleData.inner?.size || 0
          })) }
          onValueClick={ (chartPart): void => {
            if (chartPart) {
              if (legend[chartPart.index] && legend[chartPart.index].labels) {
                const newLabel = (legend[chartPart.index].labels as string[]).find((singleLabel) => singleLabel !== legend[chartPart.index].label);

                if (newLabel) {
                  setLegend({
                    ...legend,
                    [chartPart.index]: {
                      ...legend[chartPart.index],
                      label: newLabel
                    }
                  });
                }
              } else {
                setLegend({
                  ...legend,
                  [chartPart.index]: {
                    label: chartPart.label,
                    value: new Intl.NumberFormat(to6391Format(i18nInstance.language), { minimumFractionDigits: 2, style: 'currency', currency: chartPart.currency || 'EUR' }).format(Number(chartPart.value))
                  }
                });
              }
            }
          } }
          radiusType="literal"
        />
        <LineSeries
          animation
          data={ [{ x: centerModifier.x, y: -150 }, { x: centerModifier.x, y: 150 }] }
          style={ {
            stroke: '#fff',
            strokeOpacity: 1,
            strokeWidth: '4'
          } }
        />
        <LineSeries
          animation
          data={ [{ x: -150, y: centerModifier.y }, { x: 150, y: centerModifier.y }] }
          style={ {
            stroke: '#fff',
            strokeOpacity: 1,
            strokeWidth: '4'
          } }
        />
      </XYPlot>
      <div className={ `${classes.legend} bottom` }>
        {
          !!Object.keys(legend).length && [legend['2'], legend['1']]
            .map((singleLegend, index) => (
              <div className={ `${classes.legendElement} ${index % 2 === 0 ? 'left' : 'right'}` }>
                <Tooltip
                  key={ singleLegend.label }
                  open={ checkTruncation(singleLegend.label) ? undefined : false }
                  placement={ index % 2 === 0 ? 'bottom-end' : 'bottom-start' }
                  title={ singleLegend.label }
                >
                  <Typography style={ { fontWeight: 600 } }>
                    { singleLegend.label }
                  </Typography>
                </Tooltip>
                <Tooltip
                  key={ singleLegend.value }
                  open={ checkTruncation(singleLegend.value) ? undefined : false }
                  placement={ index % 2 === 0 ? 'bottom-end' : 'bottom-start' }
                  title={ singleLegend.value }
                >
                  <Typography>
                    { singleLegend.value }
                  </Typography>
                </Tooltip>
              </div>
            ))
        }
      </div>
    </Paper>
  );
};

export default FlowerChart;
