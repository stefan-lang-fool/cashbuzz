import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      paddingBottom: '24px'
    },

    '& .voucher-code-section': {
      marginTop: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  actions: {
    '&.with-code': {
      flexDirection: 'column-reverse',
      alignItems: 'flex-end',

      '& > *:not(:first-child)': {
        marginBottom: '12px'
      }
    }
  },
  paper: {
    width: '100%',
    maxWidth: '500px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px'
  }
}, { name: 'redeem-voucher-dialog' });
