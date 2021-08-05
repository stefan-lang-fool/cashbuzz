import { Action } from 'redux';

import { AuthAction } from '@/actions';
import { STANDARD } from '@/constants/httpCodes';
import http from '@/http';
import store from '@/store';

const forceLogOut = async (): Promise<void> => {
  await store.dispatch(AuthAction.logout() as unknown as Action);
};

// Request interceptor for authorization purpose
http.addRequestInterceptor(
  (request) => {
    if (store.getState().auth.accessToken && request.url && !request.url.match(/login=/)) {
      const authHeader = store.getState().auth.accessToken ? `Bearer ${store.getState().auth.accessToken}` : undefined;
      request.headers.Authorization = authHeader;
    }

    return request;
  },
  (requestError) => Promise.reject(requestError)
);

let refreshTokensPromise: null | Promise<boolean> = null;
function refreshTokens(): Promise<boolean> {
  if (!refreshTokensPromise) {
    refreshTokensPromise = (async (): Promise<boolean> => {
      // Try to refresh tokens. If it thrown error then log out user.
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await store.dispatch(AuthAction.revokeTokens() as unknown as Action);
        return true;
      } catch (error) {
        forceLogOut();
        return false;
      } finally {
        refreshTokensPromise = null;
      }
    })();
  }

  return refreshTokensPromise;
}

// Response interceptor for authorization purpose
http.addResponseInterceptor(
  async (response) => response,
  async (responseError) => {
    // If this response error is server error
    if (!responseError.response && responseError.config && responseError.config.headers.Authorization !== '') {
      // forceLogOut();
    }

    // If this response error has been thrown with 401 status code (it means that access token expired)
    if (responseError.response && responseError.response.status === STANDARD.UNAUTHORIZED && responseError.response.config.url && !responseError.response.config.url.match(/login=/)) {
      if (await refreshTokens()) {
        // After successful refresh access token operation repeat original request
        return http.request(responseError.response.config);
      }

      return false;
    }

    return Promise.reject(responseError);
  }
);
