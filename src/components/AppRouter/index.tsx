/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { AppState } from '@/reducers';
import CreditsView from '@/views/CreditsView';
import DashboardView from '@/views/DashboardView';
import ImprintView from '@/views/ImprintView';
import LoginView from '@/views/LoginView';
import OnboardingView from '@/views/OnboardingView';
import PrivacyPolicyView from '@/views/PrivacyPolicyView';
import TermsAndConditionsView from '@/views/TermsAndConditionsView';

const AppRouter = (): JSX.Element => {
  const authState = useSelector((state: AppState) => state.auth);

  const hasGuidedInTheProcess = localStorage.getItem('guided-started');

  return (
    <Switch>
      <Route
        component={ CreditsView }
        exact
        path={ ROUTES.COMMON.CREDITS }
      />
      <Route
        component={ TermsAndConditionsView }
        exact
        path={ ROUTES.COMMON.TERMS_AND_CONDITIONS }
      />
      <Route
        component={ PrivacyPolicyView }
        exact
        path={ ROUTES.COMMON.PRIVACY_POLICY }
      />
      <Route
        component={ ImprintView }
        exact
        path={ ROUTES.COMMON.IMPRINT }
      />
      <Route
        component={ OnboardingView }
        exact
        path={ ROUTES.COMMON.ONBOARDING }
      />
      {
        hasGuidedInTheProcess && (
          <Redirect to={ ROUTES.COMMON.ONBOARDING } />
        )
      }
      <Route
        path={ ROUTES.UNAUTHORIZED.REGISTER }
        render={ (): JSX.Element => (!authState.user || authState.loggedWithInvalidatedEmail || authState.requiredTosAcceptance
          ? <LoginView showMobileTeaser />
          : <Redirect to={ ROUTES.AUTHORIZED.DASHBOARD } />) }
      />
      <Route
        path={ ROUTES.UNAUTHORIZED.LOGIN }
        render={ (): JSX.Element => (!authState.user || authState.loggedWithInvalidatedEmail || authState.requiredTosAcceptance
          ? (
            <LoginView
              initialTab="login"
              showMobileTeaser
            />
          )
          : <Redirect to={ ROUTES.AUTHORIZED.DASHBOARD } />) }
      />
      <Route
        path={ ROUTES.AUTHORIZED.DASHBOARD }
        render={ (): JSX.Element => (authState.user && !authState.loggedWithInvalidatedEmail || authState.requiredTosAcceptance
          ? <DashboardView />
          : <Redirect to={ authState.hasLoggedOut ? ROUTES.UNAUTHORIZED.LOGIN : ROUTES.UNAUTHORIZED.REGISTER } />) }
      />
    </Switch>
  );
};

export default AppRouter;
