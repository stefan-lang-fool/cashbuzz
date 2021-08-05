import {
  TableCell,
  TableRow
} from '@material-ui/core';
import classNames from 'classnames';
import { Markup } from 'interweave';
import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { Suggestion } from '@/interfaces';
import { formatDate } from '@/utils/format';
import { messageTypeToClass, subjectTypeToIcon } from '@/utils/suggestions';

interface Props {
  data: Suggestion;
}

const Row = ({ data }: Props): JSX.Element => {
  const classes = styles();

  return (
    <TableRow className={ classes.row }>
      <TableCell style={ { width: 60 } }>
        <div className={ classNames({
          [classes.outline]: true,
          [messageTypeToClass[data.message_type]]: true
        }) }
        >
          <SVG src={ subjectTypeToIcon[data.subject_type] } />
        </div>
      </TableCell>
      <TableCell style={ { width: 120 } }>
        { formatDate(data.relevance_date) }
      </TableCell>
      <TableCell>
        <div style={ { color: 'black', fontSize: 16, fontWeight: 'bold' } }>{ data.hint_title }</div>
        { typeof data.hint_body === 'string' ? <Markup content={ data.hint_body } /> : data.hint_body }
      </TableCell>
    </TableRow>
  );
};

export default Row;
