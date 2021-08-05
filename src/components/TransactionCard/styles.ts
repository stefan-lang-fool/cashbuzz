import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  imgWrapper: {
    height: 150,
    width: '',

    '& img': {
      width: 'auto',
      objectFit: 'cover',
      maxHeight: '100%',
      height: 'auto'
    },

    '@media (max-width:600px)': {
      '& img': {
        width: '100%'
      }
    }
  },

  content: {
    padding: '16px 20px',
    width: '100%',
    textAlign: 'center'
  },

  title: {
    color: '#232f3e',
    marginBottom: 16
  },

  details: {
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: 'repeat( auto-fit, 130px )',
    gridGap: '4px 24px'
  },

  detailsSingle: {
    display: 'flex',
    alignItems: 'center',

    '& svg': {
      height: 36,
      width: 36,
      minWidth: 36,
      paddingRight: 8,
      marginRight: 'auto'
    }
  },

  detailsSingleLabel: {
    color: '#473630',

    '&.positive': {
      color: theme.palette.success.main
    },
    '&.negative': {
      color: theme.palette.error.main
    }
  },

  typeIndicator: {
    height: 2,
    width: '100%',

    '&.positive': {
      backgroundColor: theme.palette.success.main
    },
    '&.negative': {
      backgroundColor: theme.palette.error.main
    }
  }
}), { name: 'transaction-card' });
