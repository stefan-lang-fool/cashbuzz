import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',
    maxWidth: '900px',

    '& .section-title': {
      marginBottom: '16px'
    },

    '& .section-info': {
      marginBottom: '24px'
    },

    '&-your-code': {
      marginTop: '40px'
    },

    '& .use-code-submit': {
      minWidth: '120px'
    },

    '@media (max-width:600px)': {
      '& .MuiGrid-container .MuiGrid-item.responsive': {
        maxWidth: 'unset',
        flex: 1
      }
    },

    '& .MuiFormControl-root': {
      width: '100%'
    }
  },
  codePaper: {
    padding: '9px',

    '& h5': {
      fontSize: '18px'
    }
  }
}, { name: 'code' });
