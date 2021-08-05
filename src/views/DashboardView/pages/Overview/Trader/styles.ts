import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%',

    '& .section-title': {
      marginBottom: 32
    },

    '&-content-data-blocks': {
      marginBottom: '40px',

      '@media (max-width: 600px)': {
        '& > .MuiGrid-container': {
          flexDirection: 'column',

          '& > .MuiGrid-item': {
            width: '100%',
            maxWidth: 'unset'
          }
        }
      }
    },

    '& .data-block': {
      width: '100%',
      height: '100%'
    }
  }
}, { name: 'overview' });
