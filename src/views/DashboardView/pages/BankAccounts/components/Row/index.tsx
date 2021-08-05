/* eslint-disable no-nested-ternary */
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  TableCell,
  TableRow,
  Typography,
  useTheme
} from '@material-ui/core';
import classNames from 'classnames';
import { differenceInHours, parse } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';
import { getText } from '@/utils/data';
import { BankAccount } from '../../index';

interface Props {
  addSecurities: (data: BankAccount) => void;
  data: BankAccount;
  onVisibilityChanged: (status: boolean) => void;
  removeActionClicked: (data: BankAccount) => void;
  resyncActionClicked: (data: BankAccount) => void;
  shouldEnforceAccountSelection: boolean;
  isMobile?: boolean;
}

const Row = ({
  addSecurities,
  data,
  onVisibilityChanged,
  removeActionClicked,
  resyncActionClicked,
  shouldEnforceAccountSelection,
  isMobile = false
}: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const bankAndAccount = useMemo(() => {
    if (data.bank?.name && data.account.accountName) {
      return `${data.bank.name}: ${data.account.accountName}`;
    }

    if (data.bank?.name) {
      return data.bank.name;
    }

    if (data.account.accountName) {
      return data.account.accountName;
    }

    return getText('');
  }, [data]);

  const isSync = useMemo(() => {
    if (!data.account.lastSuccessfulUpdate) {
      return false;
    }

    const now = new Date();
    const lastSuccessfulUpdateDate = parse(data.account.lastSuccessfulUpdate.split('+')[0], 'yyyy-MM-dd HH:mm:ss', new Date());

    return differenceInHours(now, lastSuccessfulUpdateDate) <= 48;
  }, [data]);

  const visibilityAccountSelection = useMemo(() => (
    <RadioGroup
      onChange={ (event): void => { onVisibilityChanged(event.target.value === 'true'); } }
      value={ data.account.is_selected === null ? 'null' : data.account.is_selected.toString() }
    >
      {
        data.account.is_selected === null && (
          <FormControlLabel
            color="secondary"
            control={ <Radio color="primary" /> }
            label={ <Typography style={ { color: theme.custom.colors.error } }>{ t('bank_accounts.table.selection_status.null') }</Typography> }
            value="null"
          />
        )
      }
      <FormControlLabel
        control={ <Radio color="primary" /> }
        label={ t('bank_accounts.table.selection_status.yes') }
        value="true"
      />
      <FormControlLabel
        control={ <Radio color="primary" /> }
        label={ t('bank_accounts.table.selection_status.no') }
        value="false"
      />
    </RadioGroup>
  ), [data.account.is_selected, onVisibilityChanged, t, theme]);

  return (
    <>
      <TableRow
        key={ data.account.id }
        className={ classNames({
          [classes.row]: true,
          expanded: open
        }) }
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            onClick={ (): void => setOpen(!open) }
            size="small"
          >
            <SVG src={ ICONS.CHEVRON_DOWN } />
          </IconButton>
        </TableCell>
        {
          !isMobile && (
            <TableCell>
              { getText(data.bank?.name) }
            </TableCell>
          )
        }
        {
          !isMobile && <TableCell>{ data.account.accountName }</TableCell>
        }
        {
          isMobile && <TableCell>{ bankAndAccount }</TableCell>
        }
        {
          shouldEnforceAccountSelection && !isMobile && (
            <TableCell>
              { visibilityAccountSelection }
            </TableCell>
          )
        }
        <TableCell style={ {
          color:
          data.account.is_synthetic
            ? theme.palette.text.primary
            : isSync ? theme.palette.success.main : theme.palette.error.main
        } }
        >
          { data.account.is_synthetic ? getText('') : t(`bank_accounts.table.sync_status.${isSync}`) }
        </TableCell>
        <TableCell className="actions">
          <div className="actions-wrapper">
            {
              data.account.is_synthetic && (
                <Link
                  color="primary"
                  onClick={ (): void => { resyncActionClicked(data); } }
                >
                  { t('bank_accounts.resync_account') }
                </Link>
              )
            }
            {
              data.showSecurityOption && (
                <Link
                  color="primary"
                  onClick={ (): void => { addSecurities(data); } }
                >
                  { t('bank_accounts.add_securities') }
                </Link>
              )
            }
            <Link
              color="secondary"
              onClick={ (): void => { removeActionClicked(data); } }
            >
              { t('common.delete') }
            </Link>
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
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
                <Grid
                  item
                  xs={ 4 }
                >
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.iban') }
                    </Typography>
                    { getText(data.account.iban) }
                  </div>
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.bic') }
                    </Typography>
                    { getText(data.bank?.bic) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 4 }
                >
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.interface.last_update_attempt') }
                    </Typography>
                    { getText(data.account.is_synthetic ? '' : data.account.interfaces && data.account.interfaces[0]?.lastUpdateAttempt) }
                  </div>
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.interface.last_successful_update') }
                    </Typography>
                    { getText(data.account.is_synthetic ? '' : data.account.interfaces && data.account.interfaces[0]?.lastSuccessfulUpdate) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 4 }
                >
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.interface.interface') }
                    </Typography>
                    { getText(data.account.is_synthetic ? '' : data.account.interfaces && data.account.interfaces[0]?.interface) }
                  </div>
                  <div className="bank-account-detail">
                    <Typography
                      className="bank-account-detail-title"
                      variant="subtitle2"
                    >
                      { t('account.interface.interface_status') }
                    </Typography>
                    { getText(data.account.is_synthetic ? '' : data.account.interfaces && data.account.interfaces[0]?.status) }
                  </div>
                </Grid>
                {
                  shouldEnforceAccountSelection && isMobile && (
                    <Grid
                      item
                      xs
                    >
                      <div className="bank-account-detail">
                        <Typography
                          className="bank-account-detail-title"
                          variant="subtitle2"
                        >
                          { t('bank_accounts.table.columns.visibility') }
                        </Typography>
                        { visibilityAccountSelection }
                      </div>
                    </Grid>
                  )
                }
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
