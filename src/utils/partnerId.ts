/* eslint-disable import/prefer-default-export */

import { useSelector } from 'react-redux';
import { AppState } from '@/reducers';
import { AuthStateType } from '@/reducers/auth';

import store from '@/store';

export const getPartnerId = (): number => {
  const { location } = window;
  const authState: AuthStateType = store.getState().auth;

  const query = new URLSearchParams(location.search);
  const partnerQuery = query.get('partner');
  let partnerId = partnerQuery ? Number.parseInt(partnerQuery, 10) : 0;

  if (authState.user) {
    partnerId = authState.user.onboarded_by;
  }

  return partnerId;
};

export const usePartnerId = (): number => useSelector((state: AppState) => state.auth.user?.onboarded_by || 0);
