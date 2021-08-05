import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import React from 'react';
import { getI18n } from 'react-i18next';

import styles from './styles';
import { Signal } from '@/interfaces';
import { to6391Format } from '@/utils/languages';

interface Props {
  data: Signal;
}

const Row = ({ data }: Props): JSX.Element => {
  const classes = styles();
  const i18nInstance = getI18n();

  return (
    <TableRow className={ classes.row }>
      <TableCell>
        { data.date }
      </TableCell>
      <TableCell>
        { data.partner }
      </TableCell>
      <TableCell>
        { data.category }
      </TableCell>
      <TableCell>
        { data.signal }
      </TableCell>
      <TableCell
        align="right"
        className={ classNames({ amount: true, negative: data.amount < 0, positive: data.amount > 0 }) }
      >
        { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(data.amount) }
      </TableCell>
      <TableCell>
        { data.schedule }
      </TableCell>
    </TableRow>
  );
};

export default Row;
