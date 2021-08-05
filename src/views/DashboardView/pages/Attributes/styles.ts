import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',

    '& td.amount': {
      color: theme.palette.success.main,
      fontWeight: 'bold',

      '&.negative': {
        color: theme.palette.error.main
      }
    }
  }
}), { name: 'user-attributes' });
