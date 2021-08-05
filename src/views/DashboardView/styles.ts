/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',

    '& .mobile-menu-overlay': {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: '#000000',
      opacity: 0.5,
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      '&.mobile-menu-opened': {
        '& .MuiDrawer-root': {
          transform: 'translateX(0)'
        },

        '& .mobile-menu-overlay': {
          display: 'block'
        }
      }
    }
  },
  drawer: {
    width: '250px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 1px 0px black',
    transition: 'transform 0.5s',

    '& .sidebar-wrap': {
      padding: '12px'
    },

    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      zIndex: '10000',
      transform: 'translateX(-100%)',
      height: '100%'
    }
  },
  paper: {
    position: 'relative !important' as any,
    border: '0 !important',

    '&-top': {
      boxShadow: '0px 0px 1px 0px black',
      display: 'flex',
      placeItems: 'center',
      height: 60
    },

    '&-footer': {
      padding: '24px 12px 12px',
      textAlign: 'center',
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',

      '& a:not(:last-of-type)': {
        marginBottom: '8px'
      }
    },

    '& .logo': {
      maxWidth: '55%'
    },

    '& .version': {
      paddingTop: 12,
      color: theme.custom.colors.inactiveText,
      margin: '0'
    }
  },
  content: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 24px 0',
    overflowX: 'auto',
    overflowY: 'scroll',
    position: 'relative',

    '&::after': {
      content: '""',
      display: 'block',
      paddingBottom: '24px'
    },

    '& .dashboard-view-element-root': {
      position: 'relative',
      flex: '1'
    },

    [theme.breakpoints.down('sm')]: {
      marginTop: '60px'
    }
  },
  mobileTopBar: {
    position: 'fixed',
    borderRadius: 0,
    width: '100%',
    top: 0,
    left: 0,
    padding: '16px',
    height: '60px',
    display: 'none',
    zIndex: 1,

    '& svg': {
      cursor: 'pointer',
      fill: theme.palette.primary.main
    },

    '& .logo': {
      width: 'auto',
      marginLeft: 'auto',
      height: '100%'
    },

    [theme.breakpoints.down('sm')]: {
      display: 'flex'
    }
  }
}), { name: 'dashboard-view' });
