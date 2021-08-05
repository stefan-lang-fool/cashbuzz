import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: '100%',
    width: 'calc(100% - 24px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .mobile-teaser': {
      display: 'none',
      transition: 'opacity 0.5s'
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      alignItems: 'flex-start',

      '& .mobile-teaser': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        opacity: '0',
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: '16px',
        zIndex: '2',

        '& .mobile-teaser-slider': {
          flex: '1',
          display: 'flex',
          alignItems: 'center'
        },

        '& .mobile-teaser-go-to-login': {
          display: 'flex',
          justifyContent: 'center',
          margin: '24px 0',

          '& button': {
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textTransform: 'none',
            lineHeight: '32px'
          }
        },

        '& .MuiLink-root': {
          color: 'white',
          textAlign: 'center',
          textTransform: 'uppercase'
        }
      },

      '&.teaser': {
        overflow: 'hidden',

        '& .mobile-teaser': {
          display: 'flex',
          opacity: '1',
          pointerEvents: 'all'
        }
      }
    }
  },
  block: {
    minHeight: '606px',
    width: '950px',
    display: 'flex',
    padding: '0 12px',
    backgroundColor: 'white',

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      minHeight: '100%'
    },

    '&-left-column': {
      padding: '24px 32px',
      flexBasis: '380px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '14px',
      boxShadow: '2px 0px 5px 0px rgba(0,0,0, 0.5)',
      zIndex: 1,

      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },

    '&-right-column': {
      flex: 1,
      margin: '20px 0',
      backgroundColor: '#FFFFFF',
      borderRadius: '0 14px 14px 0',
      boxShadow: '-10px 7px 28px 0px rgba(0,0,0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 32px',
      overflow: 'hidden',

      '& .logo': {
        display: 'none'
      },

      [theme.breakpoints.down('sm')]: {
        boxShadow: 'unset',
        borderRadius: 'unset',
        padding: 0,
        alignItems: 'center',

        '& .logo': {
          display: 'block',
          marginBottom: '32px',
          maxWidth: '100%'
        }
      },

      '&-footer': {
        marginTop: 'auto',
        textAlign: 'center',
        paddingTop: '24px',

        '& a': {
          textTransform: 'uppercase'
        }
      }
    },

    '& .rc-tabs': {
      overflow: 'visible'
    },

    '& .rc-tabs-top': {
      border: 0,

      [theme.breakpoints.down('sm')]: {
        width: '100%'
      },

      '& .rc-tabs-bar': {
        border: 0,
        marginBottom: '24px'
      },

      '& .rc-tabs-nav-scroll': {
        width: 'unset',
        display: 'flex',

        '& .rc-tabs-nav': {
          margin: '0 auto'
        }
      },

      '& .rc-tabs-tab': {
        outline: 'none',
        textTransform: 'uppercase',

        [theme.breakpoints.down('sm')]: {
          '&:last-of-type': {
            marginRight: 0
          }
        },

        '&.rc-tabs-tab-active, &:hover': {
          color: theme.palette.primary.main
        }
      },

      '& .rc-tabs-ink-bar': {
        backgroundColor: theme.palette.primary.main
      }
    },

    '& .rc-tabs-tabpane': {
      outline: 'none',
      overflow: 'visible'
    },

    '& .MuiFormHelperText-root': {
      margin: '0',
      bottom: '-22px'
    }
  }
}), { name: 'login-layout' });
