import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',

    '& .section:not(:last-of-type), &-chart-section > *:not(:last-child)': {
      marginBottom: '40px'
    },

    '& .section-title': {
      marginBottom: '32px'
    },

    '& .finance-groups-chart': {
      overflow: 'hidden'
    }
  },

  liquidityPickerSection: {
    marginBottom: 16,
    padding: 8,

    '& > *:not(:last-child)': {
      marginRight: 8
    }
  },

  cardsSection: {
    maxWidth: 1272,
    margin: '0 auto',
    display: 'grid',
    gridGap: 24,
    gridTemplateColumns: 'repeat(auto-fit, 300px)'
  },

  hint: {
    background: 'black',
    opacity: '0.9',
    borderRadius: '8px',
    padding: '8px'
  },

  financeGroupTableHeaderCell: {
    '&.future': {
      backgroundColor: theme.custom.colors.inactiveText
    }
  },

  todayCrosshair: {
    color: 'black',

    '& .rv-crosshair__inner': {
      textAlign: 'center',
      fontWeight: 'bold'
    }
  }
}), { name: 'overview' });
