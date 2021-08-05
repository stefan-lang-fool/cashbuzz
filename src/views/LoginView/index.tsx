import 'rc-tabs/assets/index.css';
import Tabs from 'rc-tabs';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import TabContent from 'rc-tabs/lib/TabContent';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ForgotPasswordFlow from './components/ForgotPasswordFlow';
import LoginLayout from '@/Layouts/LoginLayout';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import TosAcceptanceForm from '@/components/TosAcceptanceForm';
import ValidateEmailForm from '@/components/ValidateEmailForm';
import { AppState } from '@/reducers';
import { getPartnerId } from '@/utils/partnerId';
import { sendLandingPageEvent } from '@/utils/trackingEvents';

type TabsType = 'register' | 'login';
const { TabPane } = Tabs;

interface Props {
  initialTab?: TabsType;
  onUserCreated?: () => void | Promise<void>;
  onUserValidated?: () => void | Promise<void>;
  showImprint?: boolean;
  showMobileTeaser?: boolean;
}

const LoginView = ({ initialTab = 'register', onUserCreated, onUserValidated, showImprint, showMobileTeaser = false }: Props): JSX.Element => {
  const { t } = useTranslation();

  const loggedWithInvalidatedEmail = useSelector((state: AppState) => state.auth.loggedWithInvalidatedEmail);
  const tosAcceptanceRequired = useSelector((state: AppState) => state.auth.requiredTosAcceptance);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const TABS = useMemo(() => ({
    LOGIN: t('auth.login'),
    REGISTER: t('auth.register')
  }), [t]);

  const activeView = useMemo(() => {
    if (tosAcceptanceRequired) {
      return <TosAcceptanceForm />;
    }

    if (loggedWithInvalidatedEmail) {
      return <ValidateEmailForm onUserValidated={ onUserValidated } />;
    }

    if (isForgotPassword) {
      return (
        <ForgotPasswordFlow
          onAbort={ (): void => { setIsForgotPassword(false); } }
          onFinish={ (): void => { setIsForgotPassword(false); } }
        />
      );
    }

    return (
      <Tabs
        defaultActiveKey={ initialTab }
        destroyInactiveTabPane
        renderTabBar={ (): JSX.Element => <ScrollableInkTabBar /> }
        renderTabContent={ (): JSX.Element => <TabContent /> }
      >
        <TabPane
          key="register"
          tab={ TABS.REGISTER }
        >
          <RegisterForm onUserCreated={ onUserCreated } />
        </TabPane>
        <TabPane
          key="login"
          tab={ TABS.LOGIN }
        >
          <LoginForm forgotPasswordClicked={ (): void => { setIsForgotPassword(true); } } />
        </TabPane>
      </Tabs>
    );
  }, [loggedWithInvalidatedEmail, initialTab, isForgotPassword, onUserCreated, onUserValidated, TABS.LOGIN, TABS.REGISTER, tosAcceptanceRequired]);

  useEffect(() => {
    const referer = localStorage.getItem('referer');

    sendLandingPageEvent(getPartnerId(), referer || undefined);
    localStorage.removeItem('referer');
  }, []);

  return (
    <LoginLayout
      element={ activeView }
      enableMobilePre={ !loggedWithInvalidatedEmail && showMobileTeaser }
      showImprint={ showImprint }
    />
  );
};

export default LoginView;
