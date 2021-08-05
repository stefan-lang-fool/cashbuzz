import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: 300,
    padding: 24,

    '& .value': {
      '&.positive': {
        color: theme.palette.success.main
      },

      '&.negative': {
        color: theme.palette.error.main
      }
    }
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 1
  },

  mainValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },

  subValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },

  content: {
    marginTop: 8
  }
}), { name: 'overview-card' });
