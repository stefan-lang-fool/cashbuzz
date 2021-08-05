import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& td.amount': {
      fontWeight: 'bold',

      '&.positive': {
        color: theme.palette.success.main
      },

      '&.negative': {
        color: theme.palette.error.main
      }
    }
  }
}), { name: 'hints-table' });
