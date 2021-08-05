import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',

    '&-header': {
      marginBottom: '28px'
    },

    '&-content': {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },

    '& .helper-text': {
      marginBottom: '24px'
    }
  },
  stepper: {
    background: 'transparent',
    maxWidth: '700px',
    margin: '0 auto'
  }
}, { name: 'add-new-bank-connection' });
