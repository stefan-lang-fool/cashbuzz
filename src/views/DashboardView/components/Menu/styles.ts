import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& svg': {
      width: '24px',
      marginRight: '24px',
      fill: '#757575'
    }
  },
  listItem: {
    transition: 'background-color 0.3s',

    '&.active': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: 'white',

      '& svg': {
        fill: 'white'
      }
    }
  }
}), { name: 'menu' });
