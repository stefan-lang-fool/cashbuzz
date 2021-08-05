import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CASHBUZZ_ACTIONS } from '@/constants/actions';
import { Action as ActionInterface } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';

export const clear = (): ActionInterface<null> => ({
  type: CASHBUZZ_ACTIONS.CLEAR
});

export const changeEnforceAccountSelection = (data: boolean): ActionInterface<boolean> => ({
  type: CASHBUZZ_ACTIONS.SET_ENFORCE_ACCOUNT_STATUS,
  data
});

export const fetchAttributes = (
  (): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      const { data } = await APIService.description.getAllAttributes();

      dispatch({
        type: CASHBUZZ_ACTIONS.SET_ATTRIBUTES,
        data: data.attributes
      });
    }
  )
);

export const fetchCashbuzzClasses = (
  (): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      const { data } = await APIService.description.getAllClasses();
      const { data: qclassesData } = await APIService.description.getAllQClasses();

      dispatch({
        type: CASHBUZZ_ACTIONS.SET_CASHBUZZ_CLASSES,
        data: data.classes
      });

      dispatch({
        type: CASHBUZZ_ACTIONS.SET_CASHBUZZ_QCLASSES,
        data: qclassesData.qclasses
      });
    }
  )
);

export const fetchCashbuzzData = (
  (id = 0): ThunkAction<void, AppState, unknown, Action<string>> => (
    async (dispatch): Promise<void> => {
      const { data } = await APIService.cashbuzz.getInfo(id);

      dispatch({
        type: CASHBUZZ_ACTIONS.SET_CASHBUZZ_POLICY,
        data
      });
    }
  )
);
