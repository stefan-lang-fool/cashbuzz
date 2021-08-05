import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    '& .profile-form > .MuiGrid-container:not(:last-of-type)': {
      marginBottom: '16px'
    },

    '& .action-buttons': {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: '12px',
      marginTop: '24px',

      '& .MuiFormControl-root': {
        width: 'auto !important',
        minWidth: '120px',

        '&:not(:last-child)': {
          marginRight: '12px'
        }
      }
    },

    '@media (max-width:600px)': {
      '& .user-profile-row': {
        flexDirection: 'column',

        '& > *': {
          maxWidth: 'unset'
        }
      }
    }
  }
}), { name: 'user-profile' });
