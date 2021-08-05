import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',

    '& .strength-bar': {
      marginTop: '-20px',
      marginBottom: '24px'
    },

    '& .MuiFormControl-root:not(:last-of-type)': {
      marginBottom: '26px'
    },

    '& .MuiFormControl-root.policy-checkbox': {
      marginTop: '24px'
    },

    '& .MuiFormControl-root.submit': {
      alignSelf: 'center',
      minWidth: '200px'
    }
  }
}, { name: 'register-form' });
