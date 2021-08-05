import {
  Button,
  Divider,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styles from './styles';
import Row, { SingleTransaction } from '../Row';
import CustomTableBody from '@/components/Table/Body';
import { ROUTES } from '@/constants';
import { Invoice, Organization } from '@/interfaces';
import { useMobile } from '@/utils/hooks';
import Form from '../../Form';

interface Props {
  addressData?: { street?: string; codeAndCity?: string; country?: string };
  invoice: Invoice;
  onRemove?: () => void | Promise<void>;
  onUpdate?: () => void | Promise<void>;
  openTransactionListView?: () => void | Promise<void>;
  organization?: Organization;
  selectedTransaction?: SingleTransaction;
}

const DetailsView = ({
  addressData,
  invoice,
  onRemove = (): void => {},
  onUpdate = (): void => {},
  openTransactionListView = (): void => {},
  organization,
  selectedTransaction
}: Props): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const history = useHistory();
  const { t } = useTranslation();

  const transactionSection = useMemo(() => {
    if (selectedTransaction) {
      return (
        <>
          <Typography
            className={ classes.sectionTitle }
            variant="h4"
          >
            { t('invoices.transaction_section.selected.title') }
          </Typography>
          <p className={ classes.sectionRemark }>{ t('invoices.transaction_section.selected.description') }</p>
          <TableContainer
            component={ Paper }
            style={ { overflowY: 'hidden' } }
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={ { width: 63 } } />
                  {
                    !isMobile && (
                      <TableCell>
                        { t('transaction.account_name') }
                      </TableCell>
                    )
                  }
                  <TableCell>
                    { t('transaction.value_date') }
                  </TableCell>
                  <TableCell>
                    { t('transaction.detected_counterparty_name') }
                  </TableCell>
                  {
                    !isMobile && (
                      <TableCell>
                        { t('transaction.category') }
                      </TableCell>
                    )
                  }
                  <TableCell
                    align="right"
                    style={ { width: 150 } }
                  >
                    { t('common.amount') }
                  </TableCell>
                  <TableCell style={ { width: 150 } }>
                    { t('invoices.table.columns.actions') }
                  </TableCell>
                </TableRow>
              </TableHead>
              <CustomTableBody
                customEmptyText={ t('transactions.past_transactions_table.no_data') }
                empty={ !selectedTransaction }
              >
                {
                  selectedTransaction && (
                    <Row
                      key={ selectedTransaction.transaction.id }
                      account={ selectedTransaction.account }
                      isMobile={ isMobile }
                      onChange={ openTransactionListView }
                      onRemove={ onRemove }
                      organization={ selectedTransaction.organization }
                      qaction={ selectedTransaction.qaction }
                      qsubject={ selectedTransaction.qsubject }
                      transaction={ selectedTransaction.transaction }
                    />
                  )
                }
              </CustomTableBody>
            </Table>
          </TableContainer>
        </>
      );
    }

    return (
      <>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('invoices.transaction_section.empty.title') }
        </Typography>
        <p className={ classes.sectionRemark }>{ t('invoices.transaction_section.empty.description') }</p>
        <Button
          color="primary"
          onClick={ (): void => { openTransactionListView(); } }
          size="large"
          variant="contained"
        >
          { t('invoices.transaction_section.empty.button') }
        </Button>
      </>
    );
  }, [classes, isMobile, onRemove, openTransactionListView, selectedTransaction, t]);

  return (
    <div className={ classes.root }>
      <Form
        goBack={ (): void => {
          history.push(ROUTES.AUTHORIZED.INVOICES);
        } }
        initialAddress={ addressData }
        initialData={ invoice }
        initialOrg={ organization }
        onUpdate={ onUpdate }
      />
      <Divider style={ { margin: '30px 0 20px' } } />
      <div className={ classes.selectedTransactionSection }>
        { transactionSection }
      </div>
    </div>
  );
};

export default DetailsView;
