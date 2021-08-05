/* eslint-disable max-len */
import {
  Typography,
  TableContainer,
  Paper,
  Table
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import React from 'react';
import { useTranslation } from 'react-i18next';

import HintsTableRow from './components/Row';
import styles from './styles';
import CustomTableBody from '@/components/Table/Body';
import { Pagination, Suggestion } from '@/interfaces';

interface Props {
  activePage: number;
  hints: Suggestion[];
  pagination?: Pagination;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const Hints = ({ activePage, hints, pagination, isLoading, onPageChange }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();

  return (
    <div className={ `${classes.root}-table-section section` }>
      <Typography
        className="section-title"
        variant="h4"
      >
        { t('overview.sme.hints.title') }
      </Typography>
      <TableContainer
        component={ Paper }
        style={ { overflowY: 'hidden' } }
      >
        <Table stickyHeader>
          <CustomTableBody
            customEmptyText={ t('contracts.contracts_and_insurances_table.no_data') }
            empty={ !hints.length }
            hasPagination={ !!pagination?.pageCount }
            loading={ false }
          >
            {
              !isLoading && hints
                .sort((a, b) => (
                  (a.order_nr !== null && a.order_nr !== undefined ? a.order_nr : Infinity) - (b.order_nr !== null && b.order_nr !== undefined ? b.order_nr : Infinity)
                ))
                .filter((_, index) => index >= (activePage - 1) * 5 && index < activePage * 5)
                .map((singleHint, index) => (
                  <HintsTableRow
                    key={ index }
                    data={ singleHint }
                  />
                ))
            }
          </CustomTableBody>
        </Table>
        {
          pagination && hints.length > 5 && (
            <PaginationEl
              color="primary"
              count={ Math.ceil(hints.length / 5) }
              onChange={ (event, page): void => onPageChange(page) }
            />
          )
        }
      </TableContainer>
    </div>
  );
};

export default Hints;
