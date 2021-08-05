import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',
    padding: '0 24px',

    '& > *:not(:last-child)': {
      marginBottom: 16
    }
  }
}, { name: 'transaction-details' });
