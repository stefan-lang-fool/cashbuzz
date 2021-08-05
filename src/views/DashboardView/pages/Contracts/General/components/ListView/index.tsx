/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import PaginationEl from '@material-ui/lab/Pagination';
import classNames from 'classnames';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Row, { SingleContract } from './Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { CATEGORIZATION } from '@/constants';
import { Contract, Pagination, Organization } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { useMobile } from '@/utils/hooks';

interface Props {
  className?: string;
  onSelect?: (contract: Contract) => void | Promise<void>;
}

const ListView = ({ className = '', onSelect = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const isMobile = useMobile();
  const { t } = useTranslation();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [contractsActivePage, setContractsActivePage] = useState(1);
  const [contractList, setContractList] = useState<SingleContract[]>([]);
  const [contractListPagination, setContractListPagination] = useState<Pagination>();
  const [isLoading, setIsLoading] = useState(true);

  const isInitRef = useRef(true);
  const loadingIdRef = useRef<null|number>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  const fetchContracts = useCallback(async (page: number, offLoading = false): Promise<void> => {
    setIsLoading(true);
    const resultData: SingleContract[] = [];
    const { data } = await APIService.contract.getAll(page);

    const missingOrgs: string[] = Array.from(new Set(data.contracts.map((singleContract) => singleContract.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
    if (missingOrgs.length) {
      const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

      missingOrgsData.forEach((singleOrganization) => {
        organizationsHelper.current[singleOrganization.id] = singleOrganization;
      });
    }

    for (const contract of data.contracts) {
      if (contract.class === 'sax') {
        continue;
      }

      const descriptionSubject = !CATEGORIZATION.MEANINGLESS_CLASSES.includes(contract.qsubject || '') ? cashbuzzQClasses.find((qclass) => qclass.label === contract.qsubject) : undefined;

      resultData.push({
        contract,
        organization: contract.org_id ? organizationsHelper.current[contract.org_id] : undefined,
        qsubject: descriptionSubject
      });
    }

    setContractList(resultData);
    setContractListPagination(data.paging);

    if (offLoading) {
      setIsLoading(false);
    }
  }, [cashbuzzQClasses]);

  useEffect(() => {
    const fetchAll = async (): Promise<void> => {
      setIsLoading(true);

      try {
        await fetchContracts(1);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
        isInitRef.current = false;
      }
    };

    fetchAll();
  }, [fetchContracts, t]);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (loadingIdRef.current) {
      closeLoading(loadingIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isInitRef.current) {
      fetchContracts(contractsActivePage, true);
    }
  }, [contractsActivePage, fetchContracts]);

  return (
    <div className={ classNames({
      [classes.root]: true,
      [className]: true
    }) }
    >
      <Typography
        className={ classes.sectionTitle }
        variant="h4"
      >
        { t('contracts.list_view.title') }
      </Typography>
      <div className={ classes.sectionContent }>
        <TableContainer
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={ { width: 63 } } />
                <TableCell style={ { minWidth: isMobile ? undefined : 300, width: isMobile ? undefined : 300 } }>
                  { t('contract.name') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell style={ { minWidth: 250, width: 250 } }>
                      { t('contract.category') }
                    </TableCell>
                  )
                }
                {
                  !isMobile && (
                    <TableCell>
                      { t('contract.first_payment') }
                    </TableCell>
                  )
                }
                {
                  !isMobile && (
                    <TableCell>
                      { t('contract.last_payment') }
                    </TableCell>
                  )
                }
                <TableCell align="right">
                  { t('contract.regular_amount') }
                </TableCell>
                {
                  !isMobile && (
                    <TableCell align="right">
                      { t('contract.total_amount') }
                    </TableCell>
                  )
                }
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('contracts.list_view.table.no_data') }
              empty={ !contractList.length }
              hasPagination={ !!contractListPagination?.pageCount }
              loading={ isLoading }
            >
              {
                contractList.map((contract) => (
                  <Row
                    key={ contract.contract.id }
                    contract={ contract.contract }
                    isMobile={ isMobile }
                    onSelect={ onSelect }
                    organization={ contract.organization }
                    qaction={ contract.qaction }
                    qsubject={ contract.qsubject }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            contractListPagination && contractListPagination.pageCount > 1
            && (
              <PaginationEl
                color="primary"
                count={ contractListPagination?.pageCount || 0 }
                onChange={ (event, page): void => { setContractsActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
    </div>
  );
};

export default ListView;
