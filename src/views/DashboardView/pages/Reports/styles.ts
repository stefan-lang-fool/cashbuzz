import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%'
  },
  sectionTitle: {
    marginBottom: 32
  },
  pickers: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 32,
    marginTop: 32,

    '& .MuiFormControl-root:nth-of-type(2)': {
      marginLeft: 120
    }
  },
  button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24,

    '& button': {
      width: 200
    }
  }
}, { name: 'affinities' });
