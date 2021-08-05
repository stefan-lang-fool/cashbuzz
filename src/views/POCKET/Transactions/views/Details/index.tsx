import {
  Button
} from '@material-ui/core';
import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './styles';
import { POCKET } from '@/assets';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/interfaces';

export interface SelectedTransaction {
  organization?: string;
  transaction: Transaction;
}

interface Props {
  transaction: SelectedTransaction;
  onBack?: () => void;
}

const TransactionsDetailsView = ({ transaction, onBack = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  return (
    <div className={ classes.root }>
      <TransactionCard
        img={ POCKET.AMAZON_LOGO }
        organization={ transaction.organization }
        transaction={ transaction.transaction }
        type="negative"
      />
      <TransactionCard
        discount="20%"
        img={ POCKET.BACKGROUND }
        organization={ transaction.organization }
        transaction={ transaction.transaction }
      />
      {
        onBack && (
          <Button
            color="secondary"
            onClick={ (): void => { onBack(); } }
            size="large"
            variant="contained"
          >
            { t('common.back') }
          </Button>
        )
      }
    </div>
  );
};

export default TransactionsDetailsView;
