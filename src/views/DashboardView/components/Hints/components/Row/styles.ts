import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  row: {
    '& > td:first-of-type': {
      padding: 0,
      height: '1em',

      '& svg': {
        width: '24px'
      }
    }
  },
  outline: {
    marginLeft: 8,
    display: 'flex',
    justifyContent: 'center',
    placeItems: 'center',

    '& svg': {
      fill: theme.custom.colors.inactiveText
    },

    '&.primary': {
      '& svg': {
        fill: theme.palette.primary.main
      }
    },

    '&.warning': {
      '& svg': {
        fill: theme.palette.error.main
      }
    },

    '&.other': {
      '& svg': {
        fill: theme.custom.colors.inactiveText
      }
    }
  }
}), { name: 'hints-table-row' });
