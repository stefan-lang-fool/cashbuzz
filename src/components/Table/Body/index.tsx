import {
  TableBody as TableBodyEl,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';

interface Props {
  customEmptyText?: string;
  empty: boolean;
  hasPagination?: boolean;
  loading?: boolean;
}

const TableBody = ({
  children,
  customEmptyText,
  empty,
  hasPagination,
  loading = false
}: PropsWithChildren<Props>): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  return (
    <TableBodyEl>
      {
        empty
          ? (
            <TableRow>
              <TableCell
                colSpan={ 20 }
                style={ { border: 0 } }
              >
                <Typography
                  className={ classNames({
                    [classes.empty]: true,
                    paginated: hasPagination
                  }) }
                  variant="subtitle1"
                >
                  { !loading && (customEmptyText || t('tables.no_data')) }
                </Typography>
              </TableCell>
            </TableRow>
          )
          : children
      }
    </TableBodyEl>
  );
};

export default TableBody;
