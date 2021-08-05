import { Reducer } from 'redux';

import { AUTH_ACTIONS } from '@/constants/actions';
import { User } from '@/interfaces';
import { Nullable } from '@/types';

export type AuthStateType = {
  accessToken: Nullable<string>;
  addressFixed: boolean;
  hasFinishedConfiguration: boolean;
  hasLoggedOut: boolean;
  loggedWithInvalidatedEmail: boolean;
  refreshToken: Nullable<string>;
  requiredTosAcceptance: boolean;
  user: Nullable<User>;
}

const initialState: AuthStateType = {
  accessToken: localStorage.getItem('accessToken'),
  addressFixed: false,
  hasFinishedConfiguration: false,
  hasLoggedOut: false,
  loggedWithInvalidatedEmail: false,
  refreshToken: localStorage.getItem('refreshToken'),
  requiredTosAcceptance: false,
  user: null
};

const authReducer: Reducer<AuthStateType> = (state: AuthStateType = initialState, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.CLEAR: {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return {
        ...initialState,
        accessToken: null,
        refreshToken: null,
        hasLoggedOut: action.data || false
      };
    }
    case AUTH_ACTIONS.SET_ADDRESS_FIXED_STATUS: {
      return {
        ...state,
        addressFixed: action.data
      };
    }
    case AUTH_ACTIONS.SET_EMAIL_VALIDATION_STATUS: {
      return {
        ...state,
        loggedWithInvalidatedEmail: action.data
      };
    }
    case AUTH_ACTIONS.SET_TOKENS: {
      localStorage.setItem('accessToken', action.data.accessToken);
      localStorage.setItem('refreshToken', action.data.refreshToken);

      return {
        ...state,
        accessToken: action.data.accessToken,
        refreshToken: action.data.refreshToken
      };
    }
    case AUTH_ACTIONS.SET_TOS_ACCEPTANCE_REQUIRED_STATUS: {
      return {
        ...state,
        requiredTosAcceptance: action.data
      };
    }
    case AUTH_ACTIONS.SET_USER_DATA: {
      return {
        ...state,
        user: { ...action.data }
      };
    }
    default:
      return state;
  }
};

export default authReducer;
