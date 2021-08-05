import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  row: {
    '&.last td': {
      borderColor: theme.palette.primary.main
    }
  }
}), { name: 'user-attributes-table-row' });
