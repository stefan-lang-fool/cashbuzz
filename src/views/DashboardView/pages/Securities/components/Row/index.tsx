/* eslint-disable no-nested-ternary */
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { useSelector } from 'react-redux';

import styles from './styles';
import { ICONS } from '@/assets';
import { Security } from '@/interfaces';
import { AppState } from '@/reducers';
import { getText } from '@/utils/data';
import { to6391Format } from '@/utils/languages';

interface Props {
  security: Security;
}

const Row = ({ security }: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const user = useSelector((state: AppState) => state.auth.user);

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={ security.id }
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
        <TableCell>{ security.isin }</TableCell>
        <TableCell>{ security.name }</TableCell>
        <TableCell align="right">
          { new Intl.NumberFormat(to6391Format(i18nInstance.languages[0]), { style: 'currency', currency: user?.currency || 'EUR' }).format(security.marketValue) }
        </TableCell>
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
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
                container
                spacing={ 3 }
              >
                <Grid
                  item
                  xs={ 6 }
                >
                  <div className="security-detail">
                    <Typography
                      className="security-detail-title"
                      variant="subtitle2"
                    >
                      { t('security.isin') }
                    </Typography>
                    { getText(security.isin) }
                  </div>
                  <div className="security-detail">
                    <Typography
                      className="security-detail-title"
                      variant="subtitle2"
                    >
                      { t('security.wkn') }
                    </Typography>
                    { getText(security.wkn) }
                  </div>
                  <div className="security-detail">
                    <Typography
                      className="security-detail-title"
                      variant="subtitle2"
                    >
                      { t('security.name') }
                    </Typography>
                    { getText(security.name) }
                  </div>
                </Grid>
                <Grid
                  item
                  xs={ 6 }
                >
                  <div className="security-detail">
                    <Typography
                      className="security-detail-title"
                      variant="subtitle2"
                    >
                      { t('security.quantity') }
                    </Typography>
                    { Math.round(security.quantityNominal) }
                  </div>
                  <div className="security-detail">
                    <Typography
                      className="security-detail-title"
                      variant="subtitle2"
                    >
                      { t('security.price') }
                    </Typography>
                    {
                      security.quoteType === 'PERC'
                        ? `${security.quote.toFixed(6)} %`
                        : new Intl.NumberFormat(to6391Format(i18nInstance.languages[0]), { style: 'currency', currency: security.quoteCurrency || 'EUR', minimumFractionDigits: 6 }).format(security.quote)
                    }
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
