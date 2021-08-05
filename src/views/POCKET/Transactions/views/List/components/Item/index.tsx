import {
  ListItem,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './styles';
import { ICONS } from '@/assets';
import CircleIcon from '@/components/CircleIcon';
import { Transaction } from '@/interfaces';
import { getText } from '@/utils/data';
import { to6391Format } from '@/utils/languages';

export interface SingleTransaction {
  transaction: Transaction;
  organization?: string;
}

interface Props extends SingleTransaction {
  onSelect?: (transaction: Transaction, org?: string) => void | Promise<void>;
}

const TransactionListItem = ({ transaction, organization, onSelect = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const { i18n: i18nInstance } = useTranslation();

  const onClickHandler = useCallback(() => onSelect(transaction, organization), [onSelect, organization, transaction]);

  return (
    <ListItem
      button
      className={ classes.root }
      onClick={ onClickHandler }
    >
      <div className={ classes.iconSection }>
        <CircleIcon
          icon={ ICONS.BOOK_OPEN_PAGE_VARIANT_OUTLINE }
          type={ transaction.amount % 2 === 0 ? 'success' : 'error' }
        />
      </div>
      <Typography className={ classes.contentSection }>
        { getText(organization) }
      </Typography>
      <Typography className={ classNames({ [classes.amountSection]: true, negative: transaction.amount < 0, positive: transaction.amount >= 0 }) }>
        { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(transaction.amount) }
      </Typography>
    </ListItem>
  );
};

export default TransactionListItem;
