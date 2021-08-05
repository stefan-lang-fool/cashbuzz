import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',

    '& .search-field': {
      marginBottom: '24px',
      maxWidth: '410px',

      '& svg': {
        width: '24px'
      }
    },

    '& .MuiFormControl-root': {
      width: '100%'
    }
  },
  wrapper: {
    position: 'relative'
  },
  loading: {
    position: 'absolute',
    display: 'flex',
    placeItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    opacity: 0.7,
    zIndex: 1
  },
  bankCardSection: {
    maxWidth: 1272,
    margin: '40px auto 60px',
    display: 'grid',
    gridGap: 24,
    gridTemplateColumns: 'repeat(auto-fit, 230px)',
    width: '100%'
  },
  bankCard: {
    display: 'flex',
    marginBottom: 8,
    height: 60,
    cursor: 'pointer',
    border: '2px solid',
    borderColor: theme.custom.colors.primary,
    boxShadow: 'none',
    justifyContent: 'start',
    textTransform: 'none',

    '& .MuiButton-label': {
      '& h6': {
        fontSize: '1rem'
      }
    },

    '&:hover': {
      backgroundColor: '#CAE1FF'
    },

    '& svg': {
      width: '40px',
      maxHeight: '40px',
      marginRight: 12
    },

    '& img': {
      width: 40,
      marginRight: 12
    },

    '&.mocked': {
      '& svg': {
        width: '32px',
        maxHeight: '32px',
        marginRight: 10,
        fill: '#757575'
      }
    }
  }
}), { name: 'bank-list-table' });
