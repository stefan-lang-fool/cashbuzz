import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
  },
  tickLabel: {
    '& text': {
      transform: 'translate(4px, 14px) rotate(-90deg)'
    }
  },
  hint: {
    background: 'black',
    opacity: '0.9',
    borderRadius: '8px',
    padding: '8px'
  }
}), { name: 'financial-group-chart-small' });
