import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import DialogTitle from '@/components/DialogTitle';

interface Props {
  isOpened: boolean;
  onCancel: () => Promise<void> | void;
  onOk: () => Promise<void> | void;
  question: string | JSX.Element;
  title: string;
}

const ConfirmationDialog = ({ isOpened, onCancel, onOk, question, title }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async (): Promise<void> => {
    setIsLoading(true);

    await onOk();

    setIsLoading(false);
  };

  return (
    <Dialog
      className={ classes.root }
      disableBackdropClick
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }
    >
      <DialogTitle title={ title } />
      <DialogContent dividers>
        { question }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={ onCancel }
          size="large"
          variant="contained"
        >
          { t('common.cancel') }
        </Button>
        <Button
          className="confirm-button"
          color="secondary"
          disabled={ isLoading }
          onClick={ onConfirm }
          size="large"
          variant="contained"
        >
          { isLoading ? <CircularProgress size={ 26 } /> : t('common.confirm') }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
