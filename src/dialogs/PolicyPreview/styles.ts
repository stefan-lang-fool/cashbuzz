import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      paddingBottom: '24px',
      wordBreak: 'break-word'
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
    width: '100%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px'
  }
}, { name: 'policy-preview-dialog' });
