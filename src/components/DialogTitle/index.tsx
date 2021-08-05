import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';

interface Props {
  onClose?: () => void;
  title?: string;
}

const DialogTitle = ({ onClose, title }: Props): JSX.Element => {
  const classes = styles();
  return (
    <MuiDialogTitle
      className={ classes.root }
      disableTypography
    >
      <Typography variant="h6">{ title }</Typography>
      { onClose ? (
        <IconButton
          aria-label="close"
          className={ classes.closeButton }
          onClick={ onClose }
        >
          <SVG src={ ICONS.CLOSE } />
        </IconButton>
      ) : null }
    </MuiDialogTitle>
  );
};

export default DialogTitle;
