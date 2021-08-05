import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      paddingBottom: '24px'
    },

    '& .MuiFormControl-root.checkbox .MuiFormHelperText-root': {
      marginBottom: 'unset'
    },

    '& .MuiFormControl-root:not(:last-of-type)': {
      marginBottom: '26px'
    },

    '& .MuiFormControl-root.submit': {
      alignSelf: 'center',
      minWidth: '200px'
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
}, { name: 'update-partner-dialog' });
