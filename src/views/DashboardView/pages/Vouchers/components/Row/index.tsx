/* eslint-disable no-nested-ternary */
import {
  Box,
  Collapse,
  Grid,
  IconButton,
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
import { Voucher } from '@/interfaces';
import { getText } from '@/utils/data';
import { to6391Format } from '@/utils/languages';

interface Props {
  redeemActionClicked: (data: Voucher) => void;
  voucher: Voucher;
  isMobile?: boolean;
}

const Row = ({ voucher, redeemActionClicked, isMobile = false }: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={ voucher.id }
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
        <TableCell>
          <img
            alt="small-icon"
            className="small-icon"
            src={ voucher?.logoPath }
          />
        </TableCell>
        <TableCell>{ voucher.title }</TableCell>
        { !isMobile && <TableCell>{ voucher.shopName }</TableCell> }
        { !isMobile && (
          <TableCell align="right">
            {
              voucher.discountAmount
                ? voucher.isPercentage
                  ? `${voucher.discountAmount} %`
                  : new Intl.NumberFormat(to6391Format(i18nInstance.languages[0]), { style: 'currency', currency: 'EUR' }).format(voucher.discountAmount)
                : '-'
            }
          </TableCell>
        ) }
        <TableCell
          align="left"
          className="actions"
        >
          <Link
            color="primary"
            onClick={ (): void => { redeemActionClicked(voucher); } }
          >
            { t('common.redeem') }
          </Link>
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
                  xs={ 12 }
                >
                  <ReactMarkdown source={ getText(voucher.longDescription) } />
                </Grid>
                {
                  isMobile && (
                    <Grid
                      item
                      xs
                    >
                      <div className="voucher-detail">
                        <Typography
                          className="voucher-detail-title"
                          variant="subtitle2"
                        >
                          { t('voucher.shop_name') }
                        </Typography>
                        { voucher.shopName }
                      </div>
                    </Grid>
                  )
                }
                {
                  isMobile && (
                    <Grid
                      item
                      xs
                    >
                      <div className="voucher-detail">
                        <Typography
                          className="voucher-detail-title"
                          variant="subtitle2"
                        >
                          { t('voucher.discount_amount') }
                        </Typography>
                        {
                          voucher.discountAmount
                            ? voucher.isPercentage
                              ? `${voucher.discountAmount} %`
                              : new Intl.NumberFormat(to6391Format(i18nInstance.languages[0]), { style: 'currency', currency: 'EUR' }).format(voucher.discountAmount)
                            : '-'
                        }
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
