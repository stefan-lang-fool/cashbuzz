import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%'
  },

  sectionTitle: {
    marginBottom: 32
  },

  sectionContent: {
    '& td.amount': {
      color: theme.palette.success.main ? theme.palette.success.main : '#91C9C3',
      fontWeight: 'bold',

      '&.negative': {
        color: theme.palette.error.main ?  theme.palette.error.main : '#E694B0'
      }
    }
  },

  backButton: {
    marginTop: 16
  }
}), { name: 'contracts-details-view' });
