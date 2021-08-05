import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    height: '100%',

    '& .slick-slider': {
      height: '100%',

      '& .slick-dots': {
        bottom: 0
      }
    }
  }
}, { name: 'left-column' });
