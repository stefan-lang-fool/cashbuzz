import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  sectionTitle: {
    marginBottom: 16
  },

  sectionRemark: {
    margin: '0 0 32px'
  },

  table: {
    marginBottom: 24
  }
}, { name: 'edit-invoice-transactions' });
