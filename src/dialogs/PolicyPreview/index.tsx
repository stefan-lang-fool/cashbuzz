import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './styles';
import DialogTitle from '@/components/DialogTitle';

type PartnerPolicyFormData = {
  privacyPolicyAcceptance: boolean;
};

interface Props {
  content?: string;
  isOpened: boolean;
  onClose?: () => void | Promise<void>;
  title?: string;
}

const UpdatePartnerDialog = ({
  content,
  isOpened,
  onClose = (): void => {},
  title
}: Props): JSX.Element => {
  const classes = styles();

  const onDialogClose = async (): Promise<void> => {
    await onClose();
  };

  return (
    <Dialog
      className={ classes.root }
      disableBackdropClick
      fullScreen
      onClose={ onDialogClose }
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }
    >
      <DialogTitle
        onClose={ onDialogClose }
        title={ title }
      />
      <DialogContent dividers>
        <ReactMarkdown source={ content } />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePartnerDialog;
