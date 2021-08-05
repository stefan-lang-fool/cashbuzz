import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    '& > table, td, th': {
      border: '1px solid black',
      textAlign: 'right',
      padding: 8
    },

    '& > table': {
      width: '100%',
      borderCollapse: 'collapse'
    }
  },
  sectionTitle: {
    marginBottom: 32
  },
  button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 32,
    marginTop: 24,

    '& button': {
      width: 150,
      marginRight: 60
    }
  }
}, { name: 'cashback-print-table' });
