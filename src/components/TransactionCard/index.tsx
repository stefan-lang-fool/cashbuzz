import {
  Paper,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import { format, parse } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';
import { Transaction } from '@/interfaces';
import { getCurrentDateFormat } from '@/utils/format';
import { to6391Format } from '@/utils/languages';

interface Detail {
  icon: string;
  value: string;
  type?: 'positive' | 'negative';
}

interface Props {
  transaction: Transaction;
  discount?: string;
  img?: string;
  organization?: string;

  type?: 'positive' | 'negative';
}

const TransactionCard = ({
  transaction,
  discount,
  img,
  organization,
  type = 'positive'
}: Props): JSX.Element => {
  const classes = styles();
  const { i18n: i18nInstance, t } = useTranslation();

  const currentDateFormat = useMemo(() => getCurrentDateFormat(), []);

  const details = useMemo(() => {
    const currentDate = parse(transaction.valueDate, 'yyyy-MM-dd', new Date());
    const result: Detail[] = [];

    // Amount
    result.push({
      icon: ICONS.BOOK_OPEN_PAGE_VARIANT_OUTLINE,
      value: new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(transaction.amount),
      type
    });

    // Date
    result.push({
      icon: ICONS.CALENDAR,
      value: format(currentDate, currentDateFormat)
    });

    // Distance
    result.push({
      icon: ICONS.MAP_MARKER,
      value: '2 km'
    });

    // Discount
    if (discount) {
      result.push({
        icon: ICONS.TICKET_PERCENT_OUTLINE,
        value: t('transaction-card.discount', { amount: discount }),
        type: 'positive'
      });
    }

    return result;
  }, [currentDateFormat, discount, i18nInstance, t, transaction, type]);

  return (
    <Paper className={ classes.root }>
      <div className={ classes.imgWrapper }>
        { img && <img src={ img } /> }
      </div>
      <div className={ classes.content }>
        <Typography
          className={ classes.title }
          variant="h5"
        >
          { organization }
        </Typography>
        <div className={ classes.details }>
          {
            details.map((singleDetail) => (
              <div className={ classes.detailsSingle }>
                <SVG src={ singleDetail.icon } />
                <Typography className={ classNames({ [classes.detailsSingleLabel]: true, [singleDetail.type || '']: true }) }>
                  { singleDetail.value }
                </Typography>
              </div>
            ))
          }
        </div>
      </div>
      <div className={ classNames({ [classes.typeIndicator]: true, [type]: true }) } />
    </Paper>
  );
};

export default TransactionCard;
