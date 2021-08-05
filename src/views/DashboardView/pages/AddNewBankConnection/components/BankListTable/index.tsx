import {
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import BankShortcutDialog from './components/BankShortcutDialog';
import styles from './styles';
import { ICONS } from '@/assets';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { ROUTES } from '@/constants';
import { SingleConfig, BANKS_PARTNER_0, BANKS, OTHER_BANKS } from '@/constants/bankShortcuts';
import { Bank, Pagination } from '@/interfaces';
import APIService from '@/services/APIService';
import { BankInterfaceOptionType, ConsumerType } from '@/types';
import { usePartnerId } from '@/utils/partnerId';
import { bankConnection, guidedTour } from '@/utils/trackingEvents';

const MIN_SEARCH_CHAR = 3;

interface Props {
  isGuided?: boolean;
  consumerType: ConsumerType;
  onSelect?: (id: number, selectedInterface?: BankInterfaceOptionType) => void | Promise<void>;
}

const BankListTable = ({ onSelect = (): void => {}, isGuided = false, consumerType }: Props): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [bankList, setBankList] = useState<Bank[]>([]);
  const [bankPagination, setBankPagination] = useState<Pagination>();
  const [selectedBankShortcut, setSelectedBankShortcut] = useState<SingleConfig>();
  const [isBankShortcutDialogOpened, setIsBankShortcutDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedInterfaces, setSelectedInterfaces] = useState<{[key: string]: BankInterfaceOptionType}>({});

  const banksTimeoutId = useRef<number>();
  const sectionRef = useRef<HTMLDivElement>(null);

  const banksShortcuts = useMemo((): SingleConfig[] => {
    switch (partnerId) {
      case 0:
        return BANKS_PARTNER_0;
      case 35:
        return BANKS;
      default:
        return OTHER_BANKS;
    }
  }, [partnerId]);

  const menuLabel = useMemo(() => {
    switch (consumerType) {
      case 'trader':
        return 'trader-connection';
      case 'sme':
        return 'sme-connection';
      case 'general':
      default:
        return 'general-connection';
    }
  }, [consumerType]);

  useEffect(() => {
    if (banksTimeoutId.current || search.length < MIN_SEARCH_CHAR) {
      window.clearTimeout(banksTimeoutId.current);
    }

    if (search.length < MIN_SEARCH_CHAR) {
      setBankList([]);
      setBankPagination(undefined);
      return;
    }

    banksTimeoutId.current = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setIsTableLoading(true);

        const { data } = await APIService.banks.searchForBanks(search, activePage);
        setBankList(data.banks);
        setBankPagination(data.paging);

        if (sectionRef && sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
        setIsTableLoading(false);
        banksTimeoutId.current = undefined;
      }
    }, 300);
  }, [activePage, search, t]);

  return (
    <>
      <Typography variant="h4">{ t('add_new_bank_connection.title') }</Typography>
      <div className={ classes.bankCardSection }>
        { banksShortcuts.map((singleBank, index) => (
          <Button
            key={ index }
            className={ `${classes.bankCard} mocked` }
            onClick={ async (): Promise<void> => {
              const formattedName = t(singleBank.name).replaceAll(' ', '-');

              if (isGuided) {
                guidedTour.sendBankShortcutClickedEvent(partnerId, formattedName);
              } else {
                bankConnection.sendBankShortcutClickedEvent(partnerId, menuLabel, formattedName);
              }

              if (singleBank.dialog) {
                setSelectedBankShortcut(singleBank);
                setIsBankShortcutDialogOpened(true);
              } else if (singleBank.redirect) {
                const { data } = await APIService.banks.searchForBanks(singleBank.search);

                if (data.banks.length === 1) {
                  const { id, blz } = data.banks[0];

                  if (isGuided) {
                    await guidedTour.sendBankConnectionChosenEvent(partnerId, blz);
                    onSelect(id, singleBank.withoutXS2A ? singleBank.interface : 'XS2A');
                  } else {
                    await bankConnection.sendBankConnectionChosenEvent(partnerId, menuLabel, blz);
                    window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.ADD_BANK_CONNECTION}/${id}?${singleBank.withoutXS2A ? `${singleBank.interface ? `selectedInterface=${singleBank.interface}` : ''}` : 'selectedInterface=XS2A'}`;
                  }
                }
              } else {
                setActivePage(1);
                setSearch(singleBank.search);
              }
            } }
          >
            { singleBank.image ? <img src={ singleBank.logo } /> : <SVG src={ singleBank.logo } /> }
            <div style={ { display: 'flex', flexDirection: 'column' } }>
              <Typography
                style={ { lineHeight: '1.4' } }
                variant="h6"
              >
                { t(singleBank.name) }
              </Typography>
              { singleBank.subLabel && (
                <Typography
                  style={ { color: 'gray', fontSize: 14, textAlign: 'start', lineHeight: '1.4' } }
                  variant="h6"
                >
                  { singleBank.subLabel }
                </Typography>
              ) }
            </div>
          </Button>
        )) }
      </div>
      <div
        ref={ sectionRef }
        className={ classes.root }
      >
        <Typography
          style={ { marginBottom: '40px' } }
          variant="h4"
        >
          { t('add_new_bank_connection.search.title') }
        </Typography>
        <TextField
          className="search-field"
          InputProps={ {
            endAdornment: (
              <InputAdornment position="end">
                { isLoading && <CircularProgress size={ 24 } /> }
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <SVG src={ ICONS.MAGNIFY } />
              </InputAdornment>
            )
          } }
          // label={ isSME ? undefined : t('add_new_bank_connection.search.label') }
          onChange={ (event): void => { setSearch(event.target.value); } }
          placeholder={ t('add_new_bank_connection.search.placeholder') }
          value={ search }
          variant="outlined"
        />
        <div className={ classes.wrapper }>
          { !!bankList.length && isTableLoading && (
            <div className={ classes.loading }>
              <CircularProgress color="primary" />
            </div>
          ) }
          { !!bankList.length && (
            <TableContainer
              component={ Paper }
              style={ { overflowY: 'hidden' } }
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{ t('add_new_bank_connection.table.columns.name') }</TableCell>
                    <TableCell style={ { width: 150 } }>
                      { t('add_new_bank_connection.table.columns.bic') }
                    </TableCell>
                    <TableCell style={ { width: 150 } }>
                      { t('add_new_bank_connection.table.columns.blz') }
                    </TableCell>
                    <TableCell style={ { width: 150 } }>
                      { t('add_new_bank_connection.table.columns.actions') }
                    </TableCell>
                    <TableCell style={ { width: 170 } }>
                      { t('add_new_bank_connection.table.columns.advanced_options') }
                    </TableCell>
                  </TableRow>
                </TableHead>
                <CustomTableBody
                  customEmptyText={ t('add_new_bank_connection.table.no_data') }
                  empty={ !bankList.length }
                  hasPagination={ !!bankPagination?.pageCount }
                  loading={ isLoading }
                >
                  {
                    bankList.map((bank) => (
                      <TableRow key={ bank.id }>
                        <TableCell>{ bank.name }</TableCell>
                        <TableCell>{ bank.bic }</TableCell>
                        <TableCell>{ bank.blz }</TableCell>
                        <TableCell>
                          <Link onClick={ async (): Promise<void> => {
                            if (isGuided) {
                              await guidedTour.sendBankConnectionChosenEvent(partnerId, bank.blz);
                            } else {
                              await bankConnection.sendBankConnectionChosenEvent(partnerId, menuLabel, bank.blz);
                            }

                            onSelect(bank.id, selectedInterfaces[bank.id]);
                          } }
                          >
                            { t('common.connect') }
                          </Link>

                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue="AUTOMATIC"
                            onChange={ (event): void => {
                              setSelectedInterfaces({
                                ...selectedInterfaces,
                                [bank.id]: event.target.value === 'AUTOMATIC' ? undefined : event.target.value
                              });
                            } }
                            style={ { maxWidth: '138px', width: '100%' } }
                          >
                            <MenuItem value="AUTOMATIC">{ t('add_new_bank_connection.interface_selection.AUTOMATIC') }</MenuItem>
                            { bank.interfaces.map((bankInterface) => (
                              <MenuItem
                                key={ bankInterface.interface }
                                value={ bankInterface.interface }
                              >
                                { t(`add_new_bank_connection.interface_selection.${bankInterface.interface}`) }
                              </MenuItem>
                            )) }
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </CustomTableBody>
              </Table>
              {
                bankPagination && bankPagination.pageCount > 1 && (
                  <PaginationEl
                    color="primary"
                    count={ bankPagination?.pageCount || 0 }
                    onChange={ (event, page): void => { setActivePage(page); } }
                    page={ activePage }
                  />
                )
              }
            </TableContainer>
          ) }
        </div>
      </div>
      <BankShortcutDialog
        bankShortcut={ selectedBankShortcut }
        isOpened={ isBankShortcutDialogOpened }
        onClose={ (): void => { setIsBankShortcutDialogOpened(false); } }
      />
    </>
  );
};

export default BankListTable;
