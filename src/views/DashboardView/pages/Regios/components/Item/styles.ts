import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    animation: '$appear 300ms',
    alignItems: 'flex-start',
    background: '#edf7ed',
    display: 'flex',
    border: '1px solid gray',
    borderRadius: 5,
    padding: '10px 20px',
    margin: '5px 0'
  },

  progress: {
    width: 60
  },

  contentSection: {
    flex: 1,
    margin: '0 10px 0 30px'
  },

  amountSection: {
    alignSelf: 'flex-end',

    '&.positive': {
      color: theme.palette.success.main
    },

    '&.negative': {
      color: theme.palette.error.main
    }
  },

  '@keyframes appear': {
    '0%': {
      opacity: 0,
      transform: 'translateY(50px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}), { name: 'transaction-list-item' });
