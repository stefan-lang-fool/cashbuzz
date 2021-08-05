import { Button, Link, useTheme } from '@material-ui/core';
import classNames from 'classnames';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import LeftColumn from './components/LeftColumn';
import styles from './styles';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { AppState } from '@/reducers';

interface Props {
  element: JSX.Element | Array<JSX.Element>;
  enableMobilePre?: boolean;
  showImprint?: boolean;
}

const LoginLayout = ({ element, enableMobilePre = false, showImprint = true }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { t } = useTranslation();

  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();
  const [showMobilePre, setShowMobilePre] = useState(true);

  const isMobilePre = useMemo(() => enableMobilePre && showMobilePre && window.innerWidth < theme.breakpoints.width('md'), [enableMobilePre, showMobilePre, theme.breakpoints]);

  return (
    <div className={ classNames({
      [classes.root]: true,
      'login-layout': true,
      teaser: isMobilePre
    }) }
    >
      <div className="mobile-teaser">
        <div className="mobile-teaser-slider">
          <LeftColumn />
        </div>
        <div className="mobile-teaser-go-to-login">
          <Button onClick={ (): void => { setShowMobilePre(false); } }>
            { t('login.continue_to_login') }
          </Button>
        </div>
        <Link
          onClick={ (): void => {
            setPolicyPreviewContent({ content: cashbuzzData?.impressum, title: t('menu.imprint') });
            setPolicyPreviewDialogOpened(true);
          } }
          style={ { color: 'white', textAlign: 'center', textTransform: 'uppercase' } }
        >
          { t('menu.imprint') }
        </Link>
      </div>
      <div className={ `${classes.block} login-layout-block` }>
        <div className={ `${classes.block}-left-column left-column` }>
          <LeftColumn />
        </div>
        <div className={ `${classes.block}-right-column right-column` }>
          <img
            alt="logo"
            className="logo"
            src={ theme.custom.logo }
          />
          { element }
          <div
            className={ `${classes.block}-right-column-footer` }
            style={ { display: `${showImprint ? '' : 'none'}` } }
          >
            <Link onClick={ (): void => {
              setPolicyPreviewContent({ content: cashbuzzData?.impressum, title: t('menu.imprint') });
              setPolicyPreviewDialogOpened(true);
            } }
            >
              { t('menu.imprint') }
            </Link>
          </div>
        </div>
      </div>
      <PolicyPreviewDialog
        content={ policyPreviewContent?.content }
        isOpened={ policePreviewDialogOpened }
        onClose={ (): void => { setPolicyPreviewDialogOpened(false); } }
        title={ policyPreviewContent?.title }
      />
    </div>
  );
};

export default LoginLayout;
