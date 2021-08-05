/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TableCell,
  TableRow
} from '@material-ui/core';
import classNames from 'classnames';
import { format, parse } from 'date-fns';
import React, { useMemo } from 'react';

import styles from './styles';
import { Attribute, UserAttribute } from '@/interfaces';
import { getText } from '@/utils/data';
import { getCurrentDateFormat } from '@/utils/format';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';

export interface SingleAttribute {
  attribute: UserAttribute;
  attributeDescription?: Attribute;
  lastEl?: boolean;
  value: any;
}

const Row = ({ attribute, attributeDescription, lastEl = false, value }: SingleAttribute): JSX.Element => {
  const classes = styles();

  const date = useMemo(() => format(parse(attribute.valid_date, 'yyyy-MM-dd', new Date()), getCurrentDateFormat()), [attribute.valid_date]);

  const group = useMemo(() => {
    if (!attributeDescription) {
      return undefined;
    }

    const currentLanguage = getCurrentLanguage();

    switch (currentLanguage) {
      case 'en':
        return attributeDescription.group_en;
      case 'de':
      default:
        return attributeDescription.group_de;
    }
  }, [attributeDescription]);

  const splitTypeDetails = useMemo(() => attribute.type_details?.split('_') || [], [attribute.type_details]);
  const isAmount = useMemo(() => splitTypeDetails[0] === 'currency', [splitTypeDetails]);

  const localValue = useMemo(() => {
    const currentLanguage = getCurrentLanguage();

    if (isAmount) {
      return new Intl.NumberFormat(to6391Format(currentLanguage), { style: 'currency', currency: splitTypeDetails[1] || 'EUR' }).format(value);
    }

    return value === null ? value : value.toString();
  }, [isAmount, splitTypeDetails, value]);

  const name = useMemo(() => {
    if (!attributeDescription) {
      return undefined;
    }

    const currentLanguage = getCurrentLanguage();

    switch (currentLanguage) {
      case 'en':
        return attributeDescription.name_en;
      case 'de':
      default:
        return attributeDescription.name_de;
    }
  }, [attributeDescription]);

  const section = useMemo(() => {
    if (!attributeDescription) {
      return undefined;
    }

    const currentLanguage = getCurrentLanguage();

    switch (currentLanguage) {
      case 'en':
        return attributeDescription.section_en;
      case 'de':
      default:
        return attributeDescription.section_de;
    }
  }, [attributeDescription]);

  return (
    <TableRow className={ classNames({
      [classes.row]: true,
      last: lastEl
    }) }
    >
      <TableCell>
        { getText(section) }
      </TableCell>
      <TableCell>
        { getText(group) }
      </TableCell>
      <TableCell>
        { getText(name) }
      </TableCell>
      <TableCell>
        { getText(date) }
      </TableCell>
      <TableCell className={ classNames({ amount: isAmount, negative: value < 0, positive: value > 0 }) }>
        { getText(localValue) }
      </TableCell>
    </TableRow>
  );
};

export default Row;
