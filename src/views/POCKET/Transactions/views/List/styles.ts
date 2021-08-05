import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%'
  },

  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },

  transactionGroup: {

  },

  transactionGroupTitle: {
    padding: 16,
    backgroundColor: '#f6f6f6',
    border: 'solid #b6b6b6',
    borderWidth: '1px 0',
    fontWeight: 600,
    animation: '$appear 300ms'
  },

  transactionGroupList: {
    padding: 0,
    overflow: 'hidden',

    '& > *:not(:last-child)': {
      borderBottom: '1px solid #7a7a7a'
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
}), { name: 'transaction-list' });
