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
    }
  },

  expandableRow: {
    '& .MuiTableHead-root .MuiTableCell-root': {
      backgroundColor: theme.custom.colors.inactiveText
    },

    '& .subscription-detail': {
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

    '&.mobile > td': {
      paddingLeft: '40px !important'
    },

    '&.expanded': {
      '& > td': {
        padding: '16px 16px 16px 72px !important'
      },

      '&.mobile > td': {
        paddingLeft: '40px !important'
      }
    }
  },

  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'unset',
      marginLeft: 0,
      marginRight: 0,
      width: '100%',

      '& > *': {
        width: '100%',
        maxWidth: 'unset',
        paddingLeft: '0 !important'
      }
    }
  }
}), { name: 'list-view-row' });
