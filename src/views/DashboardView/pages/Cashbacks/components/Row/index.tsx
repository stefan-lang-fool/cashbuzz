
import {
  Box,
  Collapse,
  IconButton,
  Grid,
  Link,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import ReactMarkdown from 'react-markdown';

import styles from './styles';
import { ICONS } from '@/assets';
import { Cashback } from '@/interfaces';
import { getStatus } from '@/utils/cashbacks';
import { getText } from '@/utils/data';
import { formatDate } from '@/utils/format';
import { to6391Format } from '@/utils/languages';

interface Props {
  cashback: Cashback;
  redeemActionClicked: (data: Cashback) => void;
  isMobile?: boolean;
}

const Row = ({ cashback, redeemActionClicked, isMobile = false }: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={ cashback.id }
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
        <TableCell style={ { padding: '0 12px' } }>
          <img
            alt="icon"
            className="small-icon"
            src={ cashback.sqrdIcon }
          />
        </TableCell>
        {
          !isMobile && <TableCell>{ cashback.partnerName }</TableCell>
        }
        <TableCell>{ formatDate(cashback.value_date) }</TableCell>
        <TableCell align="right">{ new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(cashback.reward) }</TableCell>
        {
          !isMobile && <TableCell>{ getStatus(cashback.statusCode) }</TableCell>
        }
        <TableCell
          align="left"
          className="actions"
        >
          { cashback.statusCode === 0 && (
            <Link
              color="primary"
              onClick={ (): void => { redeemActionClicked(cashback); } }
            >
              { t('common.redeem') }
            </Link>
          ) }
        </TableCell>
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
        mobile: isMobile,
        expanded: open
      }) }
      >
        <TableCell
          colSpan={ 8 }
          style={ { paddingBottom: 0, paddingTop: 0, border: 0 } }
        >
          <Collapse
            in={ open }
            timeout="auto"
            unmountOnExit
          >
            <Box margin={ 1 }>
              <Grid
                alignItems="center"
                className={ classes.gridContainer }
                container
                spacing={ 3 }
              >
                <Grid
                  item
                  style={ {
                    paddingBottom: isMobile ? 0 : undefined
                  } }
                  xs={ 4 }
                >
                  <img
                    alt="big-icon"
                    src={ cashback?.bigIcon }
                  />
                </Grid>
                <Grid
                  item
                  style={ {
                    paddingBottom: isMobile ? 0 : undefined
                  } }
                  xs={ 5 }
                >
                  <ReactMarkdown source={ getText(cashback.rewardText) } />
                </Grid>
                <Grid
                  item
                  style={ {
                    alignSelf: 'flex-start',
                    paddingTop: isMobile ? undefined : '35px'
                  } }
                  xs={ 3 }
                >
                  <div className="cashback-detail">
                    <Typography
                      className="cashback-detail-title"
                      variant="subtitle2"
                    >
                      { t('cashback.expiration_date') }
                    </Typography>
                    { formatDate(cashback.expiry_date) }
                  </div>
                </Grid>
                {
                  isMobile && (
                    <Grid
                      item
                      style={ {
                        alignSelf: 'flex-start'
                      } }
                      xs={ 3 }
                    >
                      <div className="cashback-detail">
                        <Typography
                          className="cashback-detail-title"
                          variant="subtitle2"
                        >
                          { t('cashback.status') }
                        </Typography>
                        { getStatus(cashback.statusCode) }
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
