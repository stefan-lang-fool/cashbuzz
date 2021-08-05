import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  row: {
    '& .actions a': {
      padding: '4px 0'
    },

    '& .actions a:not(:last-of-type)': {
      marginRight: '16px'
    },

    '& .actions-wrapper': {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }
}, { name: 'documents-table-row' });
