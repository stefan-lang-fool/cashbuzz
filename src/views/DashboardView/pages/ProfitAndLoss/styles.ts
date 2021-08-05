import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '100%',

    '& td.amount': {
      fontWeight: 'bold',

      '&.positive': {
        color: theme.palette.success.main
      },

      '&.negative': {
        color: theme.palette.error.main
      }
    },

    '& th, & td': {
      padding: '16px 8px'
    }
  },

  pickerSection: {
    marginBottom: 24,

    '& > *:not(:last-child)': {
      marginRight: 8
    }
  },

  sectionTitle: {
    marginBottom: 32
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

  financeGroupTableChartCell: {
    padding: 8,

    '& > *': {
      margin: '0 auto'
    }
  }
}), { name: 'profit-and-loss' });
