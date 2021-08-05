import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%'
  },
  row: {
    '& .actions a:not(:last-of-type)': {
      marginRight: '16px'
    },
    '& .MuiIconButton-label svg': {
      width: '24px'
    },

    '&.expanded': {
      '& .MuiIconButton-label svg': {
        transform: 'rotateZ(180deg)'
      }
    }
  },
  expandableRow: {
    '& .bank-account-detail': {
      '&:not(:last-of-type)': {
        marginBottom: '24px'
      },

      '&-title': {
        fontWeight: 'bold'
      }
    },

    '& > td': {
      padding: '0 16px 0 72px !important',
      transition: 'padding 0.3s'
    },

    '&.expanded': {
      '& > td': {
        padding: '16px 16px 16px 72px !important'
      }
    }
  }
}, { name: 'bank-accounts' });
