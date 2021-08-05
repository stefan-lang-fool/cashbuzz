import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider, ThemeOptions, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { Action } from 'redux';
import 'react-vis/dist/style.css';

import './App.css';
import './i18n';
import './styles';
import '@/interceptors';
import { Styling } from './interfaces';
import APIService from './services/APIService';
import { AuthAction, CashbuzzAction } from '@/actions';
import AppRouter from '@/components/AppRouter';
import { loading, closeLoading, CustomLoaderInit } from '@/components/CustomLoader';
import { AuthStateType } from '@/reducers/auth';
import defaultStylings from '@/resources/stylings';
import store from '@/store';

const defaultThemeSettings: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 420,
      md: 780,
      lg: 1280,
      xl: 1920
    }
  },
  overrides: {
    MuiTableCell: {
      head: {
        backgroundColor: defaultStylings.colors.primary
      },
      stickyHeader: {
        backgroundColor: defaultStylings.colors.primary
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 14
      },
      tooltipPlacementBottom: {
        margin: '4px 0 !important'
      }
    }
  },
  palette: {
    background: {
      default: defaultStylings.colors.background
    },
    error: {
      main: defaultStylings.colors.error
    },
    primary: {
      main: defaultStylings.colors.primary,
      contrastText: '#FFFFFF'
    },
    success: {
      main: defaultStylings.colors.success
    },
    text: {
      primary: defaultStylings.colors.bodyText
    },
    warning: {
      main: defaultStylings.colors.inactiveText
    }
  },
  typography: {
    fontFamily: defaultStylings.fontFamily,
    h1: {
      color: defaultStylings.colors.headings
    },
    h2: {
      color: defaultStylings.colors.headings
    },
    h3: {
      color: defaultStylings.colors.headings
    },
    h4: {
      color: defaultStylings.colors.headings
    },
    h5: {
      color: defaultStylings.colors.headings
    },
    h6: {
      color: defaultStylings.colors.headings
    }
  }
};

const defaultTheme = createMuiTheme({
  ...defaultThemeSettings,
  custom: defaultStylings
});

const styles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%'
  }
}), { name: 'app' });

const App = (): JSX.Element => {
  const { location } = window;
  const classes = styles();
  const [authState, setAuthState] = useState<AuthStateType>(store.getState().auth);
  const authUserRef = useRef(store.getState().auth.user);
  const [loadingId, setLoadingId] = useState<null|number>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingAll = useRef(true);
  const [theme, setTheme] = useState(defaultTheme);

  const getPartnerId = (): number => {
    const query = new URLSearchParams(location.search);
    const partnerQuery = query.get('partner');
    let partnerId = partnerQuery ? Number.parseInt(partnerQuery, 10) : 0;

    if (authUserRef.current) {
      partnerId = authUserRef.current.onboarded_by;
    }

    return partnerId;
  };

  const fetchCashbuzzData = async (): Promise<void> => {
    const partnerId = getPartnerId();

    await store.dispatch((CashbuzzAction.fetchCashbuzzData(partnerId) as unknown as Action));
  };

  const fetchStylings = async (): Promise<void> => {
    setIsLoading(true);
    const partnerId = getPartnerId();

    if (partnerId !== null) {
      try {
        const { data } = await APIService.partners.get(partnerId);

        console.log('data >>>', data)
        store.dispatch(CashbuzzAction.changeEnforceAccountSelection(data.enforce_account_selection));

        if (data.styling) {
          const styling = (JSON.parse(data.styling)) as Styling;

          setTheme(createMuiTheme({
            ...defaultThemeSettings,
            custom: styling,
            overrides: {
              MuiTableCell: {
                head: {
                  backgroundColor: styling.colors?.primary || defaultStylings.colors.primary
                },
                stickyHeader: {
                  backgroundColor: styling.colors?.primary || defaultStylings.colors.primary
                }
              },
              MuiTooltip: {
                tooltip: {
                  fontSize: 14
                },
                tooltipPlacementBottom: {
                  margin: '4px 0 !important'
                }
              }
            },
            palette: {
              background: {
                default: styling.colors?.background
              },
              error: {
                main: styling.colors?.error || defaultStylings.colors.error
              },
              primary: {
                main: styling.colors?.primary || defaultStylings.colors.primary,
                contrastText: '#FFFFFF'
              },
              secondary: styling.colors?.secondary
                ? {
                  main: styling.colors.secondary
                }
                : undefined,
              success: {
                main: styling.colors?.success || defaultStylings.colors.success
              },
              text: {
                primary: styling.colors?.bodyText
              },
              warning: {
                main: styling.colors?.inactiveText || defaultStylings.colors.inactiveText
              }
            },
            typography: {
              fontFamily: styling.fontFamily || defaultStylings.fontFamily,
              h1: {
                color: styling.colors?.headings
              },
              h2: {
                color: styling.colors?.headings
              },
              h3: {
                color: styling.colors?.headings
              },
              h4: {
                color: styling.colors?.headings
              },
              h5: {
                color: styling.colors?.headings
              },
              h6: {
                color: styling.colors?.headings
              }
            }
          }));
        }
      } catch {}
    } else {
      setTheme(defaultTheme);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const storeUpdated = (): void => {
      setAuthState(store.getState().auth);
      authUserRef.current = store.getState().auth.user;
    };
    store.subscribe(storeUpdated);

    const fetchUserDataFunction = async (): Promise<void> => {
      await store.dispatch((AuthAction.fetchUserData(true) as unknown as Action));
    };

    const fetchAttributes = async (): Promise<void> => {
      await store.dispatch((CashbuzzAction.fetchAttributes() as unknown as Action));
    };

    const fetchClasses = async (): Promise<void> => {
      await store.dispatch((CashbuzzAction.fetchCashbuzzClasses() as unknown as Action));
    };

    const fetchAll = async (): Promise<void> => {
      if (authState.accessToken && !authState.user) {
        await fetchUserDataFunction();
        await fetchAttributes();
        await fetchClasses();

        localStorage.removeItem('referer');
      } else {
        localStorage.setItem('referer', document.referrer);
      }

      await fetchCashbuzzData();
      await fetchStylings();

      isFetchingAll.current = false;
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!isFetchingAll.current) {
      fetchStylings();
      fetchCashbuzzData();
    }
  }, [authState.user?.id]);

  useEffect(() => {
    if (isLoading) {
      setLoadingId(loading());
    } else {
      closeLoading(loadingId);
      setLoadingId(null);
    }
  }, [isLoading]);

  return (
    <Provider store={ store }>
      <ThemeProvider theme={ theme }>
        <Router>
          <CssBaseline />
          <div
            className={ classes.root }
            style={ { background: theme.custom.colors.background || defaultStylings.colors.background } }
          >
            { !isLoading && <AppRouter /> }
          </div>
          <CustomLoaderInit color={ theme.palette.primary.main } />
          <ToastContainer transition={ Slide } />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
