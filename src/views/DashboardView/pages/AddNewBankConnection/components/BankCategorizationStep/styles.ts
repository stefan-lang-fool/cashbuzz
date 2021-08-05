import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  icon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24,

    '& svg': {
      width: 100,
      height: 100
    },

    '&.success svg': {
      fill: theme.palette.success.main
    },

    '&.error svg': {
      fill: theme.palette.error.main
    }
  },

  message: {
    fontSize: 24,
    fontWeight: 600
  },

  button: {
    marginTop: 24
  }
}), { name: 'bank-categorization-step' });
