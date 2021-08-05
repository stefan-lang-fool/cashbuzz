import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#fffff'
  },

  hidden: {
    display: 'none'
  },

  sectionTitle: {
    marginBottom: 32
  },

  sectionContent: {
    '& .actions a:not(:last-of-type)': {
      marginRight: '16px'
    },

    '& td.amount': {
      color: theme.palette.success.main ? theme.palette.success.main : '#91C9C3',
      fontWeight: 'bold',

      '&.negative': {
        color: theme.palette.error.main ?  theme.palette.error.main : '#E694B0'
      }
    }
  }
}), { name: 'contracts' });
