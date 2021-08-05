/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import { format, parse } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Row, { SingleAttribute } from './components/Row';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import CustomTableBody from '@/components/Table/Body';
import { Organization, Pagination } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { getCurrentDateFormat } from '@/utils/format';

const Attributes = (): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  const attributes = useSelector((state: AppState) => state.cashbuzz.attributes);

  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userAttributeList, setUserAttributeList] = useState<SingleAttribute[]>([]);
  const [userAttributeListPagination, setUserAttributeListPagination] = useState<Pagination>();

  const loadingIdRef = useRef<null | number>(null);
  const organizationsHelper = useRef<{[key: string]: Organization}>({});

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      const { data } = await APIService.user.getAttributes(activePage);

      const filteredAttributes = data.attributes.filter((singleAttribute) => singleAttribute.value !== null);

      const missingOrgs: string[] = Array.from(
        new Set(filteredAttributes
          .filter((singleAttribute) => singleAttribute.type_details === 'organizations')
          .map((singleAttribute) => singleAttribute.value))
      ).filter((id) => !organizationsHelper.current[id]);

      if (missingOrgs.length) {
        const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

        missingOrgsData.forEach((singleOrganization) => {
          organizationsHelper.current[singleOrganization.id] = singleOrganization;
        });
      }

      const singleAttributeList: SingleAttribute[] = [];

      for (const attribute of filteredAttributes) {
        const description = attributes?.find((singleDescription) => {
          if (
            singleDescription.group === attribute.attribute_group
            && singleDescription.name === attribute.attribute_name
            && singleDescription.section === attribute.attribute_section
          ) {
            return true;
          }

          return false;
        });

        const splitTypeDetails = attribute.type_details?.split('_') || [];

        let value = '';
        if (attribute.value !== null) {
          switch (attribute.value_type) {
            case 'bool':
              value = t(`common.bool.${attribute.value}`);
              break;
            case 'date':
              value = format(parse(attribute.value, 'yyyy-MM-dd', new Date()), getCurrentDateFormat());
              break;
            case 'id':
              switch (splitTypeDetails[0]) {
                case 'organizations':
                default:
                  value = organizationsHelper.current[attribute.value].name || '';
              }
              break;
            case 'text':
            default:
              value = attribute.value;
          }
        }

        singleAttributeList.push({
          attribute,
          attributeDescription: description,
          value
        });
      }

      const sortedAttributes = singleAttributeList.sort(
        (a, b) => (a.attributeDescription?.order_number || 0) - (b.attributeDescription?.order_number || 0) || a.attribute.valid_date.localeCompare(b.attribute.valid_date)
      );

      sortedAttributes.forEach((singleAttribute, index, array) => {
        if (array[index + 1] && singleAttribute.attribute.attribute_section !== array[index + 1].attribute.attribute_section) {
          singleAttribute.lastEl = true;
        }
      });

      setUserAttributeList(sortedAttributes);
      setUserAttributeListPagination(data.paging);
      setIsLoading(false);
    })();
  }, [activePage, attributes, t]);

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

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <TableContainer
        component={ Paper }
        style={ { overflowY: 'hidden' } }
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                { t('attributes.table.columns.section') }
              </TableCell>
              <TableCell>
                { t('attributes.table.columns.property_group') }
              </TableCell>
              <TableCell>
                { t('attributes.table.columns.property') }
              </TableCell>
              <TableCell>
                { t('attributes.table.columns.date') }
              </TableCell>
              <TableCell>
                { t('attributes.table.columns.value') }
              </TableCell>
            </TableRow>
          </TableHead>
          <CustomTableBody
            customEmptyText={ t('attributes.table.no_data') }
            empty={ !userAttributeList.length }
            hasPagination={ !!userAttributeListPagination?.pageCount }
            loading={ isLoading }
          >
            { userAttributeList.map((attribute, index) => (
              <Row
                key={ index }
                attribute={ attribute.attribute }
                attributeDescription={ attribute.attributeDescription }
                lastEl={ attribute.lastEl }
                value={ attribute.value }
              />
            )) }
          </CustomTableBody>
        </Table>
        {
          userAttributeListPagination && userAttributeListPagination.pageCount > 1 && (
            <PaginationEl
              color="primary"
              count={ userAttributeListPagination.pageCount || 0 }
              onChange={ (event, page): void => { setActivePage(page); } }
            />
          )
        }
      </TableContainer>
    </div>
  );
};

export default Attributes;
