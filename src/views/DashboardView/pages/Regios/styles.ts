import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    color: 'black'
  },
  subtitle: {
    fontSize: 18,
    margin: '10px 0'
  },
  card: {
    padding: 20,
    background: '#edf7ed',
  },
  card_title: {
    textAlign: 'center'
  },
  start: {
    fontWeight: 'bold',
    fontSize: 20,
    cursor: 'pointer',
    color: 'black',
    marginTop: 10,
    textAlign: 'center'
  },
  transactionGroupTitle: {
    padding: 16,
    backgroundColor: '#f6f6f6',
    border: 'solid #b6b6b6',
    borderWidth: '1px 0',
    fontWeight: 600,
    animation: '$appear 300ms'
  },

  transactionGroupList: {
    padding: 0,
    overflow: 'hidden',

    '& > *:not(:last-child)': {
      borderBottom: '1px solid #7a7a7a'
    }
  },
}))
