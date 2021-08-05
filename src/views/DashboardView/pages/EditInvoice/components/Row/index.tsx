import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';
import { Account, DescriptionQClassSingle, Transaction } from '@/interfaces';
import { getText } from '@/utils/data';
import { formatDate } from '@/utils/format';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';

export interface SingleTransaction {
  account?: Account;
  organization?: string;
  qaction?: DescriptionQClassSingle;
  qsubject?: DescriptionQClassSingle;
  transaction: Transaction;
}

interface Props extends SingleTransaction {
  className?: string;
  isMobile?: boolean;
  onChange?: (transaction: Transaction) => void | Promise<void>;
  onRemove?: (transaction: Transaction) => void | Promise<void>;
  onSelect?: (transaction: Transaction) => void | Promise<void>;
}

const Row = ({
  account,
  className = '',
  isMobile = false,
  onChange,
  onRemove,
  onSelect,
  organization,
  qaction,
  qsubject,
  transaction
}: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const [open, setOpen] = useState(false);

  const descriptionAction = useMemo(() => {
    const currentLanguage = getCurrentLanguage();

    if (!qaction) {
      return qaction;
    }

    switch (currentLanguage) {
      case 'en':
        return qaction.label_en;
      case 'de':
      default:
        return qaction.label_de;
    }
  }, [qaction]);

  const descriptionSubject = useMemo(() => {
    const currentLanguage = getCurrentLanguage();

    if (!qsubject) {
      return qsubject;
    }

    switch (currentLanguage) {
      case 'en':
        return qsubject.label_en;
      case 'de':
      default:
        return qsubject.label_de;
    }
  }, [qsubject]);

  const category = useMemo(() => {
    if (descriptionAction && descriptionSubject) {
      return `${descriptionSubject} - ${descriptionAction}`;
    }

    if (descriptionAction) {
      return descriptionAction;
    }

    if (descriptionSubject) {
      return descriptionSubject;
    }

    return getText('');
  }, [descriptionAction, descriptionSubject]);

  return (
    <>
      <TableRow
        key={ transaction.id }
        className={ classNames({
          [classes.row]: true,
          [className]: true,
          expanded: open
        }) }
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            onClick={ (): void => {
              setOpen(!open);
            } }
            size="small"
          >
            <SVG src={ ICONS.CHEVRON_DOWN } />
          </IconButton>
        </TableCell>
        {
          !isMobile && (
            <TableCell style={ {
              minWidth: isMobile ? undefined : 250,
              width: isMobile ? undefined : 250,
              wordBreak: 'break-word'
            } }
            >
              { getText(account?.accountName || account?.iban) }
            </TableCell>
          )
        }
        <TableCell>{ formatDate(transaction.valueDate) }</TableCell>
        <TableCell>{ getText(organization) }</TableCell>
        {
          !isMobile && <TableCell>{ category }</TableCell>
        }
        <TableCell
          align="right"
          className={ classNames({ amount: true, negative: transaction.amount < 0, positive: transaction.amount > 0 }) }
        >
          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(transaction.amount) }
        </TableCell>
        <TableCell>
          <div className={ classes.actionsWrapper }>
            {
              onSelect && (
                <Link
                  color="primary"
                  onClick={ (): void => {
                    onSelect(transaction);
                  } }
                >
                  { t('invoices.select_transaction') }
                </Link>
              )
            }
            {
              onChange && (
                <Link
                  color="primary"
                  onClick={ (): void => {
                    onChange(transaction);
                  } }
                >
                  { t('invoices.change_transaction') }
                </Link>
              )
            }
            {
              onRemove && (
                <Link
                  color="primary"
                  onClick={ (): void => {
                    onRemove(transaction);
                  } }
                >
                  { t('invoices.remove_transaction') }
                </Link>
              )
            }
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
        mobile: isMobile,
        expanded: open
      }) }
      >
        <TableCell
          colSpan={ 6 }
          style={ { paddingBottom: 0, paddingTop: 0, border: 0 } }
        >
          <Collapse
            in={ open }
            timeout="auto"
            unmountOnExit
          >
            <Box margin={ 1 }>
              <Grid
                className={ classes.gridContainer }
                container
                spacing={ 3 }
              >
                {
                  isMobile && (
                    <Grid
                      item
                      style={ { order: 1 } }
                      xs={ 6 }
                    >
                      <div className="transaction-detail">
                        <Typography
                          className="transaction-detail-title"
                          variant="subtitle2"
                        >
                          { t('transaction.account_name') }
                        </Typography>
                        { getText(account?.accountName || account?.iban) }
                      </div>
                    </Grid>
                  )
                }
                {
                  isMobile && (
                    <Grid
                      item
                      style={ { order: 1 } }
                      xs={ 6 }
                    >
                      <div className="transaction-detail">
                        <Typography
                          className="transaction-detail-title"
                          variant="subtitle2"
                        >
                          { t('transaction.category') }
                        </Typography>
                        { category }
                      </div>
                    </Grid>
                  )
                }
                <Grid
                  item
                  style={ { order: isMobile ? 3 : 1 } }
                  xs={ 6 }
                >
                  <div className="transaction-detail">
                    <Typography
                      className="transaction-detail-title"
                      variant="subtitle2"
                    >
                      { t('transaction.counterparty_iban') }
                    </Typography>
                    { getText(transaction.counterpartIban) }
                  </div>
                </Grid>
                <Grid
                  item
                  style={ { order: isMobile ? 4 : 2 } }
                  xs={ 6 }
                >
                  <div className="transaction-detail">
                    <Typography
                      className="transaction-detail-title"
                      variant="subtitle2"
                    >
                      { t('transaction.counterparty_name') }
                    </Typography>
                    { getText(transaction.counterpartName) }
                  </div>
                </Grid>
                <Grid
                  item
                  style={ { order: isMobile ? 5 : 3 } }
                  xs={ 6 }
                >
                  <div className="transaction-detail">
                    <Typography
                      className="transaction-detail-title"
                      variant="subtitle2"
                    >
                      { t('transaction.purpose') }
                    </Typography>
                    { getText(transaction.purpose) }
                  </div>
                </Grid>
                <Grid
                  item
                  style={ { order: isMobile ? 6 : 4 } }
                  xs={ 6 }
                >
                  <div className="transaction-detail">
                    <Typography
                      className="transaction-detail-title"
                      variant="subtitle2"
                    >
                      { t('transaction.mandate_reference') }
                    </Typography>
                    { getText(transaction.counterpartMandateReference) }
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
