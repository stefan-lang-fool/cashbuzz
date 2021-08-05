import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '7px 0',

    '& svg': {
      width: '24px',
      marginRight: '24px',
      fill: '#757575',
      transition: 'fill 0.3s'
    }
  }
}, { name: 'menu-item' });
