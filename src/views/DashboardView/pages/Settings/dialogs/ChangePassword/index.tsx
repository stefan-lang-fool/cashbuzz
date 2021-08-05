import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import DialogTitle from '@/components/DialogTitle';

interface Props {
  isOpened: boolean;
  onClose?: () => void;
}

const ChangePasswordDialog = ({ isOpened, onClose = (): void => {} }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();

  const onDialogClose = (): void => {
    onClose();
  };

  return (
    <Dialog
      className={ classes.root }
      disableBackdropClick
      onClose={ onDialogClose }
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }
    >
      <DialogTitle
        onClose={ onClose }
        title={ t('change_password.dialog_title') }
      />
      <DialogContent dividers>
        <ChangePasswordForm onSuccess={ onDialogClose } />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
