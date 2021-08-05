import {
  Collapse,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import classNames from 'classnames';
import { addMonths, differenceInCalendarMonths, eachMonthOfInterval, isFuture, isSameMonth, subMonths } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';
import { ConsumerType, MenuLabelsType } from '@/types';
import { getText } from '@/utils/data';
import { getName } from '@/utils/financialGroups';
import { to6391Format } from '@/utils/languages';
import { usePartnerId } from '@/utils/partnerId';
import { sendItemEvent } from '@/utils/trackingEvents';

interface Props {
  consumerType: ConsumerType;
  data: {
    label: string;
    toggle: string;
    list: {
      amount: number;
      month: string;
    }[];
  }[];
  endDate?: Date;
  onChange: (toggle: string, value: string) => void;
  startDate?: Date;
  toggle: boolean;
  type: string;
}

const Row = ({
  consumerType,
  data,
  endDate = addMonths(new Date(), 3),
  onChange,
  startDate = subMonths(new Date(), 3),
  toggle,
  type
}: Props): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const { t, i18n: i18nInstance } = useTranslation();

  const [open, setOpen] = useState(false);

  const amountByMonth = useMemo(() => data.reduce((previousResult, currentValue) => {
    currentValue.list.forEach((singleListValue, listValueIndex) => {
      previousResult[listValueIndex] += singleListValue.amount;
    });

    return previousResult;
  }, new Array(differenceInCalendarMonths(endDate, startDate) + 2).fill(0)), [data, endDate, startDate]);

  const mappedData = useMemo(() => data.map((singleGroup) => ({
    ...singleGroup,
    name: getName(singleGroup.label),
    label: singleGroup.label
  })), [data]);

  const menuLabel = useMemo((): MenuLabelsType => {
    switch (consumerType) {
      case 'general':
        return 'general-profitloss';
      case 'sme':
        return 'sme-profitloss';
      default:
        return 'general-profitloss';
    }
  }, [consumerType]);

  const rowType = useMemo(() => {
    switch (type) {
      case 'expenses':
        return t('profits_and_loss.costs');
      case 'incomes':
        return t('profits_and_loss.revenues');
      default:
        return getText();
    }
  }, [t, type]);

  return (
    <>
      <TableRow
        className={ classNames({
          [classes.row]: true,
          expanded: open
        }) }
      >
        <TableCell style={ { minWidth: 63, width: 63, maxWidth: 63 } }>
          <IconButton
            aria-label="expand row"
            onClick={ (): void => {
              if (!open) {
                sendItemEvent(partnerId, menuLabel, rowType);
              }
              setOpen(!open);
            } }
            size="small"
          >
            <SVG src={ ICONS.CHEVRON_DOWN } />
          </IconButton>
        </TableCell>
        <TableCell style={ { fontWeight: 'bold', minWidth: 155, width: 155 } }>{ rowType }</TableCell>
        <TableCell style={ { minWidth: 70, width: 70, maxWidth: 70 } }>
          <Switch
            checked={ toggle }
            color="primary"
            onChange={ (): void => { onChange(type, toggle ? 'off' : 'on'); } }
          />
        </TableCell>
        {
          eachMonthOfInterval({ start: startDate, end: endDate }).map((singleDate, index) => (
            <TableCell
              key={ singleDate.toString() }
              align="center"
              className={ classNames({
                amount: true,
                future: isFuture(singleDate) || isSameMonth(singleDate, new Date()),
                negative: amountByMonth[index] < 0,
                positive: amountByMonth[index] > 0
              }) }
              style={ { minWidth: 148, width: 148 } }
            >
              { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(amountByMonth[index]) }
            </TableCell>
          ))
        }
      </TableRow>
      <TableRow className={ classNames({
        [classes.expandableRow]: true,
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
            <Table style={ { tableLayout: 'fixed' } }>
              <TableBody>
                {
                  mappedData.map((singleGroup) => (
                    <TableRow key={ singleGroup.label }>
                      <TableCell style={ { minWidth: 56, width: 56, maxWidth: 56 } } />
                      <TableCell style={ { minWidth: 139, width: 139 } }>
                        { singleGroup.name }
                      </TableCell>
                      <TableCell style={ { minWidth: 63, width: 63, maxWidth: 63 } }>
                        <Switch
                          checked={ singleGroup.toggle === 'on' }
                          color="primary"
                          onChange={ (): void => { onChange(singleGroup.label, singleGroup.toggle === 'on' ? 'off' : 'on'); } }
                        />
                      </TableCell>
                      { singleGroup.list.map((singleGroupListElement) => (
                        <TableCell
                          key={ singleGroupListElement.month }
                          align="center"
                          className={ classNames({
                            amount: true,
                            future:
                            isFuture(new Date(singleGroupListElement.month)) || isSameMonth(new Date(singleGroupListElement.month), new Date()),
                            negative: singleGroupListElement.amount < 0,
                            positive: singleGroupListElement.amount > 0
                          }) }
                          style={ { minWidth: 148, width: 148 } }
                        >
                          { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(singleGroupListElement.amount) }
                        </TableCell>
                      )) }
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
