import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  row: {
    '& .MuiIconButton-label svg': {
      width: '24px'
    },

    '&.expanded': {
      '& .MuiIconButton-label svg': {
        transform: 'rotateZ(180deg)'
      }
    },

    '& td.future': {
      backgroundColor: `${theme.custom.colors.neutral}44`
    }
  },
  expandableRow: {
    '& .transaction-detail': {
      '&:not(:last-of-type)': {
        marginBottom: '24px'
      },

      '&-title': {
        fontWeight: 'bold'
      }
    },

    '& > td': {
      padding: '0 !important',
      transition: 'padding 0.3s'
    },

    '& td.future': {
      backgroundColor: `${theme.custom.colors.neutral}44`
    }
  }
}), { name: 'finance-group-table-row' });
