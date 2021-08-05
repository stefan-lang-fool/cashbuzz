import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 16,
    animation: '$appear 300ms',
    alignItems: 'flex-start',
  },

  iconSection: {
    '& svg': {
      fill: theme.palette.text.primary
    }
  },

  contentSection: {
    flex: 1,
    margin: '0 16px'
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
