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
      color: theme.palette.success.main,
      fontWeight: 'bold',

      '&.negative': {
        color: theme.palette.error.main
      }
    }
  },

  backButton: {
    marginTop: 16
  }
}), { name: 'details-view' });
