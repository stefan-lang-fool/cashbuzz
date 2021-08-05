import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',

    '&-header': {
      fontSize: '16px',
      marginBottom: 24
    }
  },
  loading: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  policyContent: {

  },
  form: {
    display: 'flex',
    flexDirection: 'column',

    '& .MuiFormControl-root.submit': {
      marginTop: '24px',
      alignSelf: 'flex-start',
      minWidth: '200px'
    }
  },
  returnButton: {
    marginBottom: '24px',

    '& svg': {
      width: '24px',
      height: '24px',
      fill: theme.palette.primary.main
    }
  }
}), { name: 'partner-policy-page' });
