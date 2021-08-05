/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Link,
  TableCell,
  TableRow
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { Document } from '@/interfaces';
import { DocumentStatusType } from '@/types';
import { getText } from '@/utils/data';
import { getCurrentDateFormat } from '@/utils/format';

export interface SingleDocument {
  document: Document;
  organization?: string;
}

interface Props extends SingleDocument {
  onDeleteClicked?: (document: Document) => void | Promise<void>;
  onDownloadClicked?: (document: Document) => void | Promise<void>;
  onViewClicked?: (document: Document) => void | Promise<void>;
}

const deleteArray: DocumentStatusType[] = ['uploaded', 'rejected'];

const Row = ({
  document,
  organization,
  onDeleteClicked = (): void => {},
  onDownloadClicked = (): void => {},
  onViewClicked = (): void => {}
}: Props): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  const date = useMemo(() => format(parseISO(document.upload_ts), getCurrentDateFormat()), [document]);

  const showDelete = useMemo(() => deleteArray.includes(document.file_status), [document]);

  return (
    <TableRow className={ classes.row }>
      <TableCell>
        { getText(date) }
      </TableCell>
      <TableCell>
        { getText(document.file_name) }
      </TableCell>
      <TableCell>
        { document.file_status ? t(`document.status.${document.file_status}`) : getText(undefined) }
      </TableCell>
      <TableCell align="right">
        { document.cashback_count !== null ? document.cashback_count : getText(undefined) }
      </TableCell>
      <TableCell>
        { getText(organization) }
      </TableCell>
      <TableCell className="actions">
        <div className="actions-wrapper">
          <Link
            color="primary"
            onClick={ (): void => { onDownloadClicked(document); } }
          >
            { t('common.download') }
          </Link>
          <Link
            color="primary"
            onClick={ (): void => { onViewClicked(document); } }
          >
            { t('common.view') }
          </Link>
          {
            showDelete && (
              <Link
                color="secondary"
                onClick={ (): void => { onDeleteClicked(document); } }
              >
                { t('common.delete') }
              </Link>
            )
          }
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Row;
