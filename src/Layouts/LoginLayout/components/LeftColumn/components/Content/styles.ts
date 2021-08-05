import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',

    '& .slick-slider': {
      height: '100%',

      '& .slick-dots': {
        bottom: 0
      }
    },

    '&-img-wrapper': {
      height: '150px',
      width: '150px',
      margin: '24px 0',
      borderRadius: '50%',
      background: '#FFFFFF',
      padding: '37px'
    },

    '&-img': {
      height: '100%',
      width: '100%',
      fill: theme.palette.primary.main
    }
  },

  content: {
    textAlign: 'center',
    color: '#FFFFFF',

    '&-title': {
      fontWeight: '800',
      fontSize: '20px'
    },

    '&-description': {
      whiteSpace: 'pre-line',
      lineHeight: '32px',
      fontSize: '16px'
    }
  }
}), { name: 'left-column-content' });
