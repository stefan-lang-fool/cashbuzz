import {
  Paper,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import { format, addMonths } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';

interface Props {
  isPartial?: boolean;
  mainValue: number;
  subValue: number;
  title: string;
}

const OverviewCard = ({ isPartial = true, mainValue, subValue, title, children }: PropsWithChildren<Props>): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const today = new Date();
  const monthAfter = addMonths(new Date(), 1);

  return (
    <Paper className={ classes.root }>
      <Typography
        className={ classes.title }
        variant="h6"
      >
        { title }
      </Typography>
      <Typography
        className={ classNames({
          [classes.mainValue]: true,
          value: true,
          negative: mainValue < 0,
          positive: mainValue > 0
        }) }
        variant="body1"
      >
        <span>
          { `${isPartial ? '~' : ''}${new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(Math.round(mainValue)))}` }
          <span style={ { color: 'black', fontSize: 20 } }>
            { ` ${t('overview.kpi-cards.in')} ${format(today, 'MMMM', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale })}` }
          </span>
        </span>
      </Typography>
      <Typography
        className={ classNames({
          [classes.subValue]: true,
          value: true,
          negative: mainValue < 0,
          positive: mainValue > 0
        }) }
        variant="h6"
      >
        <span>
          { `${isPartial ? '~' : ''}${new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(Math.round(subValue)))}` }
          <span style={ { color: 'black', fontSize: 14 } }>
            { ` ${t('overview.kpi-cards.in')} ${format(monthAfter, 'MMMM', { locale: getCurrentLanguage() === 'en' ? enLocale : deLocale })}` }
          </span>
        </span>
      </Typography>
      <div className={ classes.content }>
        { children }
      </div>
    </Paper>
  );
};

export default OverviewCard;
