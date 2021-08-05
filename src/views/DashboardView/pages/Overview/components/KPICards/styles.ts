import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
  },
  cardsSection: {
    maxWidth: 1272,
    margin: '0 auto',
    display: 'grid',
    gridGap: 24,
    gridTemplateColumns: 'repeat(auto-fit, 300px)'
  }
}), { name: 'kpi-card' });
