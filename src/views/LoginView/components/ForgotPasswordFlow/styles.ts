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
    },

    '& .return-link': {
      alignSelf: 'center',
      marginTop: '24px'
    }
  },
  stepper: {
    marginBottom: '24px'
  }
}, { name: 'forgot-password-flow' });
