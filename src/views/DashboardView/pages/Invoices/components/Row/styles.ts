import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    '& .MuiIconButton-label svg': {
      width: '24px'
    },

    '& > td': {
      padding: '24px 16px'
    },

    '&.opened': {
      '& .chevron .MuiIconButton-label svg': {
        transform: 'rotateZ(180deg)'
      }
    },

    '& .MuiInputBase-root': {
      fontSize: 14,
      width: 150
    },

    '& .MuiOutlinedInput-input': {
      padding: '6px 12px !important'
    },

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
  },
  expandableRow: {
    '& .MuiCollapse-container': {
      paddingLeft: 64
    },

    '& .invoice-detail': {
      '&:not(:last-of-type)': {
        marginBottom: '24px'
      },

      '&-title': {
        fontWeight: 'bold'
      }
    },

    '& .MuiGrid-grid-xs-6': {
      maxWidth: 250
    },

    '& .MuiFormControl-root': {
      margin: '0 16px',

      '& label': {
        whiteSpace: 'nowrap'
      }
    },

    '& .MuiOutlinedInput-input': {
      width: 150
    }
  }
}), { name: 'invoices-row' });
