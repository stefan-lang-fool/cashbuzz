import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',
    maxWidth: '900px',

    '&-account': {
      margin: '28px 0 40px',

      '&-element': {
        fontSize: '16px',

        '&-title': {
          fontWeight: 'bold'
        }
      },

      '@media (max-width:600px)': {
        '& .language-select .MuiGrid-item:nth-child(2)': {
          maxWidth: 'unset',
          flex: 1
        },

        '& .MuiGrid-container .MuiGrid-item.responsive': {
          maxWidth: 'unset',
          flex: 1
        }
      }
    },

    '& .section-title': {
      marginBottom: '32px'
    },

    '& .MuiFormControl-root': {
      width: '100%'
    }
  }
}, { name: 'settings' });
