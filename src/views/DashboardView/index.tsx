import {
  Drawer,
  Link,
  Paper,
  useTheme
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { useHistory } from 'react-router';

import Menu from './components/Menu';
import styles from './styles';

import { ICONS } from '@/assets';
import AuthorizedRouter from '@/components/AppRouter/components/Authorized';
import { KPI, ROUTES } from '@/constants';

const DashboardView = (): JSX.Element => {
  const classes = styles();
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();

  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KPI.NAME)) {
      localStorage.setItem(KPI.NAME, JSON.stringify(KPI.INITIAL_STATE));
    }
  }, []);

  return (
    <div className={ classNames({
      [classes.root]: true,
      'mobile-menu-opened': mobileMenuOpened
    }) }
    >
      <Drawer
        anchor="left"
        className={ classes.drawer }
        PaperProps={ { className: classes.paper } }
        variant="permanent"
      >
        <div className={ `${classes.paper}-top sidebar-wrap` }>
          <img
            alt="logo"
            className="logo"
            src={ theme.custom.logo }
          />
        </div>
        <div className={ `${classes.paper}-menu` }>
          <Menu onClick={ (): void => { setMobileMenuOpened(false); } } />
        </div>
        <div className={ `${classes.paper}-footer` }>
          <Link onClick={ (): void => { history.push(ROUTES.COMMON.IMPRINT); } }>{ t('menu.imprint') }</Link>
          <Link onClick={ (): void => { history.push(ROUTES.COMMON.TERMS_AND_CONDITIONS); } }>{ t('menu.terms_of_use') }</Link>
          <Link onClick={ (): void => { history.push(ROUTES.COMMON.PRIVACY_POLICY); } }>{ t('menu.privacy_policy') }</Link>
          <Link onClick={ (): void => { history.push(ROUTES.COMMON.CREDITS); } }>{ t('menu.credits') }</Link>
          <p className="version">Version 1.0.7</p>
        </div>
      </Drawer>
      <main
        className={ classes.content }
        id="main-content"
      >
        <Paper className={ classes.mobileTopBar }>
          <SVG
            onClick={ (): void => { setMobileMenuOpened(!mobileMenuOpened); } }
            src={ ICONS.MENU }
            style={ { width: '28px' } }
          />
          <img
            alt="logo"
            className="logo"
            src={ theme.custom.logo }
          />
        </Paper>
        <div
          className="mobile-menu-overlay"
          onClick={ (): void => { setMobileMenuOpened(false); } }
        />
        <AuthorizedRouter />
      </main>
    </div>
  );
};

export default DashboardView;
