import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import PaginationEl from '@material-ui/lab/Pagination';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row, { SingleDocument } from './components/Row';
import styles from './styles';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import CustomTableBody from '@/components/Table/Body';
import { Document, Organization, Pagination } from '@/interfaces';
import APIService from '@/services/APIService';
import { base64ToBlob } from '@/utils/conversion';
import { usePartnerId } from '@/utils/partnerId';
import { documents as documentsEvent } from '@/utils/trackingEvents';

const Documents = (): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState(1);
  const [deleteDocumentDialogOpened, setDeleteDocumentDialogOpened] = useState(false);
  const [documentList, setDocumentList] = useState<SingleDocument[]>([]);
  const [documentListForceReload, setDocumentListForceReload] = useState(false);
  const [documentListPagination, setDocumentListPagination] = useState<Pagination>();
  const [documentToDelete, setDocumentToDelete] = useState<Document>();
  const [fileList, setFileList] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [key, setKey] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);

  const loadingIdRef = useRef<null | number>(null);
  const organizationsHelper = useRef<{ [key: string]: Organization }>({});
  const tableLoadingIdRef = useRef<null | number>(null);

  const deleteHandler = useCallback(async (): Promise<void> => {
    if (!documentToDelete) {
      return;
    }

    try {
      await APIService.documents.delete(documentToDelete.id);
      documentsEvent.sendDocumentDeletedEvent(partnerId);
      setDocumentListForceReload(!documentListForceReload);
      setDocumentToDelete(undefined);
      setDeleteDocumentDialogOpened(false);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }
  }, [documentToDelete, documentListForceReload, partnerId, t]);

  const downloadHandler = useCallback(async (file: Document): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await APIService.documents.get(file.id);

      const url = URL.createObjectURL(base64ToBlob(data, 'application/pdf'));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      documentsEvent.sendDocumentDownloadedEvent(partnerId);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, t]);

  const uploadHandler = useCallback(async (): Promise<void> => {
    setIsUploading(true);

    try {
      await Promise.all(fileList.map(async (singleFile) => {
        const formData = new FormData();
        formData.append('binary', singleFile);
        await APIService.documents.upload(singleFile.name, formData, 'trade_settlement');
      }));

      documentsEvent.sendDocumentUploadedEvent(partnerId);
      setKey(key + 1);
      setDocumentListForceReload(!documentListForceReload);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsUploading(false);
    }
  }, [documentListForceReload, fileList, key, partnerId, t]);

  const viewHandler = useCallback(async (file: Document): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await APIService.documents.get(file.id);

      const url = URL.createObjectURL(base64ToBlob(data, 'application/pdf'));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
      documentsEvent.sendDocumentViewedEvent(partnerId);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, t]);

  useEffect(() => {
    (async (): Promise<void> => {
      setTableLoading(true);
      const { data } = await APIService.documents.getAll('trade_settlement', activePage);

      const missingOrgs: string[] = Array
        .from(new Set(
          data.documents
            .map((singleDocument) => singleDocument.organization_id)
            .filter((id) => id)
        ))
        .filter((id) => !organizationsHelper.current[id as string]) as string[];

      if (missingOrgs.length) {
        const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

        missingOrgsData.forEach((singleOrganization) => {
          organizationsHelper.current[singleOrganization.id] = singleOrganization;
        });
      }

      setDocumentList(data.documents.map((singleDocument) => ({
        document: singleDocument,
        organization: singleDocument.organization_id ? organizationsHelper.current[singleDocument.organization_id]?.name : undefined
      })));
      setDocumentListPagination(data.paging);
      setTableLoading(false);
    })();
  }, [activePage, documentListForceReload]);

  useEffect(() => {
    if (tableLoading) {
      tableLoadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root .table-container' });
    } else {
      closeLoading(tableLoadingIdRef.current);
      tableLoadingIdRef.current = null;
    }
  }, [tableLoading]);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (tableLoadingIdRef.current) {
      closeLoading(tableLoadingIdRef.current);
    }

    if (loadingIdRef.current) {
      closeLoading(loadingIdRef.current);
    }
  }, []);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ classes.section }>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('documents.sections.upload.title') }
        </Typography>
        <Typography
          className={ classes.sectionSubTitle }
          variant="body2"
        >
          { t('documents.sections.upload.subTitle') }
        </Typography>
        <DropzoneArea
          key={ key }
          acceptedFiles={ ['.pdf'] }
          dropzoneClass={ classes.uploadDropZone }
          dropzoneText={ t('documents.sections.upload.text') }
          filesLimit={ 50 }
          onChange={ (list): void => {
            setFileList(list);

            if (list.length) {
              documentsEvent.sendDocumentSelectedEvent(partnerId, list.length);
            }
          } }
          previewGridClasses={ {
            container: classes.uploadPreviewList,
            item: classes.uploadPreviewListSingle
          } }
          showAlerts={ false }
          showFileNames
          useChipsForPreview

        />
        {
          !!fileList.length && (
            <Button
              className={ classes.uploadButton }
              color="primary"
              disabled={ isUploading }
              onClick={ uploadHandler }
              variant="contained"
            >
              { isUploading ? <CircularProgress size={ 24 } /> : t('common.send') }
            </Button>
          )
        }
      </div>
      <div className={ classes.section }>
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('documents.sections.list.title') }
        </Typography>
        <Typography
          className={ classes.sectionSubTitle }
          variant="body2"
        >
          { t('documents.sections.list.subTitle') }
        </Typography>
        <TableContainer
          className="table-container"
          component={ Paper }
          style={ { overflowY: 'hidden' } }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={ { width: 160, minWidth: 160 } }>{ t('document.upload_ts') }</TableCell>
                <TableCell style={ { minWidth: 400 } }>{ t('document.file_name') }</TableCell>
                <TableCell style={ { width: 200 } }>{ t('document.file_status') }</TableCell>
                <TableCell
                  align="right"
                  style={ { width: 150 } }
                >
                  { t('document.cashback') }
                </TableCell>
                <TableCell style={ { width: 250 } }>{ t('document.bank') }</TableCell>
                <TableCell style={ { width: 250 } }>
                  { t('common.actions') }
                </TableCell>
              </TableRow>
            </TableHead>
            <CustomTableBody
              customEmptyText={ t('documents.sections.list.no_data') }
              empty={ !documentList.length }
              hasPagination={ !!documentListPagination?.pageCount }
              loading={ tableLoading }
            >
              {
                documentList.map((singleDocument) => (
                  <Row
                    key={ singleDocument.document.id }
                    document={ singleDocument.document }
                    onDeleteClicked={ (document): void => {
                      setDocumentToDelete(document);
                      setDeleteDocumentDialogOpened(true);
                    } }
                    onDownloadClicked={ downloadHandler }
                    onViewClicked={ viewHandler }
                    organization={ singleDocument.organization }
                  />
                ))
              }
            </CustomTableBody>
          </Table>
          {
            documentListPagination && documentListPagination.pageCount > 1 && (
              <PaginationEl
                color="primary"
                count={ documentListPagination.pageCount || 0 }
                onChange={ (event, page): void => { setActivePage(page); } }
              />
            )
          }
        </TableContainer>
      </div>
      <ConfirmationDialog
        isOpened={ deleteDocumentDialogOpened }
        onCancel={ (): void => { setDeleteDocumentDialogOpened(false); } }
        onOk={ deleteHandler }
        question={ t('documents.delete_document_question') }
        title={ t('documents.delete_document') }
      />
    </div>
  );
};

export default Documents;
