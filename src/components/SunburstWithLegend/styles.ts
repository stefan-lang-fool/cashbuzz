import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    display: 'flex',
    padding: 12,
    position: 'relative'
  },

  chart: {
    position: 'relative'
  },

  summarize: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '35%',
    wordBreak: 'break-word',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  info: {
    flex: 1,
    wordBreak: 'break-word',

    '&-wrapper': {
      position: 'absolute'
    },

    '&-title': {
      marginBottom: 12
    }
  }
}, { name: 'sunburst-with-legend' });
