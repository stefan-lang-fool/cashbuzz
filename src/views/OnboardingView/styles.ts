import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'scroll',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',

    '&-header': {
      width: '100%',
      marginBottom: '24px'
    },

    '&-content': {
      flex: 1,
      padding: '0 24px',

      '& .section-title': {
        marginBottom: '32px'
      },

      '& .profile-form': {
        maxWidth: '900px',

        '& .MuiFormControl-root': {
          width: '100%'
        }
      }
    },

    '&-footer': {
      marginTop: '24px',
      textAlign: 'center',
      textTransform: 'uppercase'
    },

    '& .helper-text': {
      marginBottom: '24px'
    },

    [theme.breakpoints.down('sm')]: {
      padding: '0 0 24px',

      '& .login-layout .right-column .logo': {
        display: 'none'
      }
    },

    '& .onboarding-wrapper': {
      padding: '0 16px'
    }
  },
  stepper: {
    marginTop: '24px',

    [theme.breakpoints.down('sm')]: {
      padding: '12px'
    },

    [theme.breakpoints.down('xs')]: {
      padding: '12px',

      '& .MuiStepLabel-label': {
        fontSize: '10px'
      }
    }
  }
}), { name: 'onboarding-view' });
