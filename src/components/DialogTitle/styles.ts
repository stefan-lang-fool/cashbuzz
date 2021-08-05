import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    minWidth: '300px',

    '& .MuiTypography-root': {
      fontWeight: '700'
    }
  },
  closeButton: {
    top: '8px',
    right: '8px',
    position: 'absolute',

    '& svg': {
      width: '24px',
      height: '24px',
      fill: '#9e9e9e'
    }
  }
}, { name: 'dialog-title' });
