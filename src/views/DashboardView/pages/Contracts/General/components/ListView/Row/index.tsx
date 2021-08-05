/* eslint-disable max-len */

import {
  Button,
  Box,
  Collapse,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';
import { PERIODICITY } from '@/constants';
import { DescriptionQClassSingle, Organization, Contract } from '@/interfaces';
import { getText } from '@/utils/data';
import { formatDate } from '@/utils/format';
import { to6391Format, getCurrentLanguage } from '@/utils/languages';

export interface SingleContract {
  contract: Contract;
  organization?: Organization;
  qaction?: DescriptionQClassSingle;
  qsubject?: DescriptionQClassSingle;
}

interface Props extends SingleContract {
  isMobile?: boolean;
  onSelect?: (contract: Contract) => void | Promise<void>;
}

const Row = ({ contract, organization, onSelect = (): void => {}, qaction, qsubject, isMobile = false }: Props): JSX.Element => {
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

  const periodicity = useMemo(() => {
    if (!contract.periodicity) {
      return getText(undefined);
    }

    if (PERIODICITY[contract.periodicity as keyof typeof PERIODICITY]) {
      return t(`periodicity.${PERIODICITY[contract.periodicity as keyof typeof PERIODICITY]}`);
    }
    return t('periodicity.other');
  }, [contract, t]);

  return (
    <>
      <TableRow
        key={ contract.id }
        className={ classNames({
          [classes.row]: true,
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
        <TableCell style={ {
          minWidth: isMobile ? undefined : 300,
          width: isMobile ? undefined : 300,
          wordBreak: 'break-word'
        } }
        >
          { getText(organization?.name) }
        </TableCell>
        {
          !isMobile && (
            <TableCell style={ { minWidth: 250, width: 250, wordBreak: 'break-word' } }>{ category }</TableCell>
          )
        }
        {
          !isMobile && (
            <TableCell>{ formatDate(contract.start_date) }</TableCell>
          )
        }
        {
          !isMobile && (
            <TableCell>{ formatDate(contract.last_transaction) }</TableCell>
          )
        }
        <TableCell
          align="right"
          className={ classNames({ amount: true, negative: contract.amount_median < 0, positive: contract.amount_median > 0 }) }
        >
          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: contract.currency }).format(contract.amount_median) }
        </TableCell>
        {
          !isMobile && (
            <TableCell
              align="right"
              className={ classNames({ amount: true, negative: contract.amount_total < 0, positive: contract.amount_total > 0 }) }
            >
              { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: contract.currency }).format(contract.amount_total) }
            </TableCell>
          )
        }
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
        mobile: isMobile,
        expanded: open
      }) }
      >
        <TableCell
          colSpan={ 24 }
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
                style={ { alignItems: 'center' } }
              >
                <Grid
                  item
                  xs
                >
                  <Grid
                    className={ classes.gridContainer }
                    container
                    spacing={ 3 }
                    style={ { alignItems: 'center' } }
                  >
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 1 } }
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.category') }
                            </Typography>
                            { category }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 2 } }
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.first_payment') }
                            </Typography>
                            { formatDate(contract.start_date) }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 3 } }
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.last_payment') }
                            </Typography>
                            { formatDate(contract.last_transaction) }
                          </div>
                        </Grid>
                      )
                    }
                    <Grid
                      item
                      style={ { order: 4 } }
                      xs={ 6 }
                    >
                      <div className="contract-detail">
                        <Typography
                          className="contract-detail-title"
                          variant="subtitle2"
                        >
                          { t('contract.period') }
                        </Typography>
                        { periodicity }
                      </div>
                    </Grid>
                    <Grid
                      item
                      style={ { order: 5 } }
                      xs={ 6 }
                    >
                      <div className="contract-detail">
                        <Typography
                          className="contract-detail-title"
                          variant="subtitle2"
                        >
                          { t('contract.payments') }
                        </Typography>
                        { contract.transaction_count }
                      </div>
                    </Grid>
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 6 } }
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.total_amount') }
                            </Typography>
                            { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: contract.currency }).format(contract.amount_total) }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      contract.contract_ident && (
                        <Grid
                          item
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.contract_ident') }
                            </Typography>
                            { getText(contract.contract_ident) }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      contract.customer_ident && (
                        <Grid
                          item
                          xs={ 6 }
                        >
                          <div className="contract-detail">
                            <Typography
                              className="contract-detail-title"
                              variant="subtitle2"
                            >
                              { t('contract.customer_ident') }
                            </Typography>
                            { getText(contract.customer_ident) }
                          </div>
                        </Grid>
                      )
                    }
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={ 2 }
                >
                  {
                    contract.transaction_count > 0 && (
                      <Grid
                        item
                        style={ {
                          display: 'flex',
                          justifyContent: isMobile ? undefined : 'flex-end',
                          marginTop: isMobile ? 16 : undefined
                        } }
                        xs
                      >
                        <Button
                          color="primary"
                          onClick={ (): void => { onSelect(contract); } }
                          size="large"
                          variant="contained"
                        >
                          { t('contracts.list_view.table.bookings_button') }
                        </Button>
                      </Grid>
                    )
                  }
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
