import {
  Box,
  Button,
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
import { DescriptionQClassSingle, Organization, Subscription } from '@/interfaces';
import { getText } from '@/utils/data';
import { formatDate } from '@/utils/format';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';
import { usePartnerId } from '@/utils/partnerId';
import { sendItemEvent } from '@/utils/trackingEvents';

export interface SingleSubscription {
  industry?: DescriptionQClassSingle;
  organization?: Organization;
  subscription: Subscription;
}

interface Props extends SingleSubscription {
  isMobile?: boolean;
  onSelect?: (subscription: Subscription) => void | Promise<void>;
}

const Row = ({ industry, onSelect = (): void => {}, organization, subscription, isMobile = false }: Props): JSX.Element => {
  const classes = styles();
  const { t, i18n: i18nInstance } = useTranslation();

  const partnerId = usePartnerId();
  const [open, setOpen] = useState(false);

  const localizedIndustry = useMemo(() => {
    const currentLanguage = getCurrentLanguage();

    if (!industry) {
      return undefined;
    }

    switch (currentLanguage) {
      case 'en':
        return industry.label_en;
      case 'de':
      default:
        return industry.label_de;
    }
  }, [industry]);

  const periodicity = useMemo(() => {
    if (!subscription.periodicity) {
      return getText(undefined);
    }

    if (PERIODICITY[subscription.periodicity as keyof typeof PERIODICITY]) {
      return t(`periodicity.${PERIODICITY[subscription.periodicity as keyof typeof PERIODICITY]}`);
    }
    return t('periodicity.other');
  }, [subscription, t]);

  return (
    <>
      <TableRow
        key={ subscription.id }
        className={ classNames({
          [classes.row]: true,
          expanded: open
        }) }
      >
        <TableCell>
          {
            subscription.transaction_count > 0 && (
              <IconButton
                aria-label="expand row"
                onClick={ (): void => {
                  if (!open) {
                    sendItemEvent(partnerId, 'sme-expenses', 'item_view');
                  }
                  setOpen(!open);
                } }
                size="small"
              >
                <SVG src={ ICONS.CHEVRON_DOWN } />
              </IconButton>
            )
          }
        </TableCell>
        <TableCell>{ getText(organization?.name) }</TableCell>
        {
          !isMobile && <TableCell>{ getText(localizedIndustry) }</TableCell>
        }
        <TableCell
          align="right"
          className={ classNames({ amount: true, negative: subscription.amount_total < 0, positive: subscription.amount_total > 0 }) }
        >
          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: subscription.currency }).format(subscription.amount_total) }
        </TableCell>
        {
          !isMobile && <TableCell>{ periodicity }</TableCell>
        }
        {
          !isMobile && <TableCell align="right">{ subscription.transaction_count }</TableCell>
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
                    <Grid
                      item
                      style={ { order: 2 } }
                      xs={ 6 }
                    >
                      <div className="subscription-detail">
                        <Typography
                          className="subscription-detail-title"
                          variant="subtitle2"
                        >
                          { t('subscription.first_payment') }
                        </Typography>
                        { formatDate(subscription.start_date) }
                      </div>
                    </Grid>
                    <Grid
                      item
                      style={ { order: 3 } }
                      xs={ 6 }
                    >
                      <div className="subscription-detail">
                        <Typography
                          className="subscription-detail-title"
                          variant="subtitle2"
                        >
                          { t('subscription.last_payment') }
                        </Typography>
                        { subscription.last_transaction ? formatDate(subscription.last_transaction) : getText(undefined) }
                      </div>
                    </Grid>
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 1 } }
                          xs={ 6 }
                        >
                          <div className="subscription-detail">
                            <Typography
                              className="subscription-detail-title"
                              variant="subtitle2"
                            >
                              { t('subscription.industry') }
                            </Typography>
                            { getText(localizedIndustry) }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 4 } }
                          xs={ 6 }
                        >
                          <div className="subscription-detail">
                            <Typography
                              className="subscription-detail-title"
                              variant="subtitle2"
                            >
                              { t('subscription.period') }
                            </Typography>
                            { periodicity }
                          </div>
                        </Grid>
                      )
                    }
                    {
                      isMobile && (
                        <Grid
                          item
                          style={ { order: 5 } }
                          xs={ 6 }
                        >
                          <div className="subscription-detail">
                            <Typography
                              className="subscription-detail-title"
                              variant="subtitle2"
                            >
                              { t('subscription.number_of_transactions') }
                            </Typography>
                            { subscription.transaction_count }
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
                    subscription.transaction_count > 0 && (
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
                          onClick={ (): void => { onSelect(subscription); } }
                          size="large"
                          variant="contained"
                        >
                          { t('expenses.bookings_button') }
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
