import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      padding: '24px',
      borderTop: '0',
      fontSize: '16px'
    },

    '& .MuiDialogActions-root': {
      padding: '16px 24px'
    },

    '& .confirm-button': {
      minWidth: '120px'
    }
  },
  paper: {
    width: '100%',
    maxWidth: '500px'
  }
}, { name: 'confirmation-dialog' });
