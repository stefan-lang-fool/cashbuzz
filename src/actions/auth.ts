/* eslint-disable no-throw-literal */
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { fetchAttributes, fetchCashbuzzClasses } from './cashbuzz';

import { loading, closeLoading } from '@/components/CustomLoader';
import { LoginFormData } from '@/components/LoginForm';
import { showNotification } from '@/components/Notification';
import { AUTH_ACTIONS } from '@/constants/actions';
import { ONBOARDING, SETTINGS } from '@/constants/httpCodes';
import i18nInstance from '@/i18n';
import { Action as ActionInterface, EditUserProfileData, Tokens, User } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { to6391Format } from '@/utils/languages';
import { getPartnerId } from '@/utils/partnerId';
import { sendDashboardEvent } from '@/utils/trackingEvents';

export const acceptToS = (
  (): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      await APIService.cashbuzz.acceptPolicy();

      dispatch({
        type: AUTH_ACTIONS.SET_TOS_ACCEPTANCE_REQUIRED_STATUS,
        data: false
      });
    }
  )
);

export const changeUserData = (
  (data: EditUserProfileData): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      const { data: responseData, status } = await APIService.user.changeProfileData(data);

      if (status === SETTINGS.TYPO) {
        dispatch(setAddressFixedStatus(true));
        throw { message: i18nInstance.t('edit_profile.type_error'), status, data: responseData, type: 'warning' };
      } else if (status === SETTINGS.INVALID_ADDRESS) {
        throw { message: i18nInstance.t('edit_profile.invalid_address'), status, data: responseData, endEditing: true, type: 'error' };
      } else {
        dispatch(setAddressFixedStatus(false));
      }

      await dispatch(fetchUserData());
    }
  )
);

export const changeNotificationEmailsStatus = (
  (value: boolean): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      await APIService.user.changeProfileData({ send_reminders: value });

      await dispatch(fetchUserData());
    }
  )
);

export const changeUserLanguage = (
  (language: string | undefined): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      await APIService.user.changeProfileData({ language });

      await dispatch(fetchUserData());
    }
  )
);


export const clear = (): ActionInterface<null> => ({
  type: AUTH_ACTIONS.CLEAR
});

export const fetchUserData = (
  (refresh = false): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch, getState): Promise<void> => {
      const state = getState();
      const { refreshToken } = state.auth;

      const { data: userData } = await APIService.authentication.me();

      if (refreshToken && refresh) {
        const { status } = await APIService.tokens.revoke(refreshToken);

        switch (status) {
          case ONBOARDING.NOT_VALIDATED_EMAIL:
            if (!state.auth.loggedWithInvalidatedEmail) {
              dispatch({
                type: AUTH_ACTIONS.SET_EMAIL_VALIDATION_STATUS,
                data: true
              });
            }

            break;
          case ONBOARDING.REQUIRE_TOS_ACCEPTANCE:
            if (!state.auth.requiredTosAcceptance) {
              dispatch({
                type: AUTH_ACTIONS.SET_TOS_ACCEPTANCE_REQUIRED_STATUS,
                data: true
              });
            }

            break;
          default:
            break;
        }
      }

      i18nInstance.changeLanguage(to6391Format(userData.language) || '');

      dispatch(setUserData(userData));
    }
  )
);

export const login = (
  (data: LoginFormData, fromRegistrationForm = false): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      const { data: loginResponseData, status } = await APIService.authentication.logInUser(data.email, data.password);
      await dispatch(fetchAttributes());
      await dispatch(fetchCashbuzzClasses());

      dispatch({
        type: AUTH_ACTIONS.SET_TOS_ACCEPTANCE_REQUIRED_STATUS,
        data: status === ONBOARDING.REQUIRE_TOS_ACCEPTANCE
      });

      dispatch(setTokens({
        accessToken: loginResponseData.authkey,
        refreshToken: loginResponseData.refreshtoken
      }));

      await dispatch(fetchUserData());

      if (fromRegistrationForm && loginResponseData.id) {
        localStorage.setItem('register-time', JSON.stringify({
          [loginResponseData.id]: new Date().toISOString()
        }));
      }

      await sendDashboardEvent(getPartnerId());

      dispatch({
        type: AUTH_ACTIONS.SET_EMAIL_VALIDATION_STATUS,
        data: status === ONBOARDING.NOT_VALIDATED_EMAIL
      });
    }
  )
);

export const logout = (
  (): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch, getState): Promise<void> => {
      const loaderId = loading();

      try {
        await APIService.authentication.logout();
      } catch {
        showNotification({ content: i18nInstance.t('common.internal_error'), type: 'error' });
      } finally {
        const { user } = getState().auth;

        closeLoading(loaderId);
        dispatch({
          type: AUTH_ACTIONS.CLEAR,
          data: true
        });
        i18nInstance.changeLanguage('');

        if (user?.onboarded_by) {
          window.location.href = `${window.location.href}?partner=${user?.onboarded_by}`;
        }
      }
    }
  )
);

export const setAddressFixedStatus = (data: boolean): ActionInterface<boolean> => ({
  type: AUTH_ACTIONS.SET_ADDRESS_FIXED_STATUS,
  data
});

export const setTokens = (data: Tokens): ActionInterface<Tokens> => ({
  type: AUTH_ACTIONS.SET_TOKENS,
  data
});

export const setUserData = (data: User): ActionInterface<User> => ({
  type: AUTH_ACTIONS.SET_USER_DATA,
  data
});

export const revokeTokens = (): ThunkAction<void, AppState, unknown, Action<string>> => (
  async (dispatch, getState): Promise<void> => {
    const { refreshToken } = getState().auth;

    if (refreshToken) {
      const { data: loginResponseData } = await APIService.tokens.revoke(refreshToken);

      dispatch(setTokens({
        accessToken: loginResponseData.authkey,
        refreshToken: loginResponseData.refreshtoken
      }));
    }
  }
);

export const validateEmail = (code: string): ThunkAction<void, AppState, unknown, Action<string>> => (
  async (dispatch): Promise<void> => {
    await APIService.authentication.verifyEmail(code);

    dispatch({
      type: AUTH_ACTIONS.SET_EMAIL_VALIDATION_STATUS,
      data: false
    });
  }
);
