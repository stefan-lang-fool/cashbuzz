import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    wordBreak: 'break-word'
  },
  header: {

  },
  content: {

  },
  returnButton: {
    marginBottom: '24px',

    '& svg': {
      width: '24px',
      height: '24px',
      fill: theme.palette.primary.main
    }
  }
}), { name: 'unauthorized-layout' });
