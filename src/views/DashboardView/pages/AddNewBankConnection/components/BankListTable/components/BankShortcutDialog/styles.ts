import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      paddingBottom: '24px'
    }
  },
  paper: {
    width: '100%',
    maxWidth: '500px'
  },

  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  imageWrapper: {
    maxWidth: '100%',
    marginBottom: 24,

    '& > *': {
      maxWidth: '100%'
    }
  },

  shortcutContent: {
    marginBottom: 24
  }
}, { name: 'bank-shortcut-dialog' });
