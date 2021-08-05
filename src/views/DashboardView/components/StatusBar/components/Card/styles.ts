import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',

    '& > svg': {
      marginLeft: 12
    }

  },
  content: {
    marginLeft: 22
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.custom.colors.inactiveText,

    '& a': {
      textDecoration: 'underline',
      color: 'rgb(0, 0, 238)'
    }
  }
}), { name: 'status-bar-card' });
