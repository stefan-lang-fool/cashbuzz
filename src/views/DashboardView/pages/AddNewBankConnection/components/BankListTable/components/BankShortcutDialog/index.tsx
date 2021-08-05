import {
  Button,
  Dialog,
  DialogContent,
  Typography
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import { useHistory } from 'react-router-dom';
import styles from './styles';
import DialogTitle from '@/components/DialogTitle';
import { SingleConfig } from '@/constants/bankShortcuts';

interface Props {
  bankShortcut?: SingleConfig;
  isOpened: boolean;
  onClose?: () => void;
}

const BankShortcutDialog = ({ bankShortcut, isOpened, onClose = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const history = useHistory();
  const { t } = useTranslation();

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
        onClose={ onDialogClose }
        title={ t(bankShortcut?.name || '') }
      />
      <DialogContent
        className={ classes.dialogContent }
        dividers
      >
        {
          bankShortcut && (
            <>
              <div className={ classes.imageWrapper }>
                { bankShortcut.image ? <img src={ bankShortcut.logo } /> : <SVG src={ bankShortcut.logo } /> }
              </div>
              <Typography
                className={ classes.shortcutContent }
                variant="body1"
              >
                { t(bankShortcut.dialog?.content || '') }
              </Typography>
              <Button
                color="primary"
                onClick={ async (): Promise<void> => {
                  if (!bankShortcut.dialog) {
                    onDialogClose();
                    return;
                  }

                  if (bankShortcut.dialog.redirect) {
                    history.push(bankShortcut.dialog.redirect);
                  }

                  if (bankShortcut.dialog.action) {
                    await bankShortcut.dialog.action();
                  }

                  onDialogClose();
                } }
                variant="contained"
              >
                { t('common.continue') }
              </Button>
            </>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default BankShortcutDialog;
