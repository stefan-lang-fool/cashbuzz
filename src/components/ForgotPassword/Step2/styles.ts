import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',

    '& .MuiFormControl-root:not(:last-of-type)': {
      marginBottom: '26px'
    },

    '& .MuiFormControl-root.submit': {
      alignSelf: 'center',
      minWidth: '200px'
    }
  }
}, { name: 'reset-password-step-two' });
