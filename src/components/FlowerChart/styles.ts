import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 12,
    position: 'relative',
    width: 324
  },
  chart: {
    '&.end': {
      alignSelf: 'flex-end'
    }
  },
  legend: {
    display: 'flex',

    '&.top': {
      marginBottom: 8
    },

    '&.bottom': {
      marginTop: 8
    }
  },
  legendElement: {
    width: '50%',

    '&.left': {
      textAlign: 'right',
      paddingRight: 4
    },

    '&.right': {
      textAlign: 'left',
      paddingLeft: 4
    },

    '& > *': {
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  }
}, { name: 'flower-chart' });
