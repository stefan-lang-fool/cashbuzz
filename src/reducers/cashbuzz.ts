import { Reducer } from 'redux';

import { CASHBUZZ_ACTIONS } from '@/constants/actions';
import { Attribute, CashbuzzData, DescriptionClass, DescriptionQClass } from '@/interfaces';
import { Nullable } from '@/types';

export type CashbuzzStateType = {
  attributes: Nullable<Attribute[]>;
  classes: Nullable<DescriptionClass[]>;
  data: Nullable<CashbuzzData>;
  enforceAccountSelection: boolean;
  qclasses: DescriptionQClass[];
}

const initialState: CashbuzzStateType = {
  attributes: [],
  classes: [],
  data: null,
  enforceAccountSelection: false,
  qclasses: []
};

const cashbuzzReducer: Reducer<CashbuzzStateType> = (state: CashbuzzStateType = initialState, action) => {
  switch (action.type) {
    case CASHBUZZ_ACTIONS.CLEAR: {
      return {
        ...initialState
      };
    }
    case CASHBUZZ_ACTIONS.SET_ATTRIBUTES: {
      return {
        ...state,
        attributes: action.data
      };
    }
    case CASHBUZZ_ACTIONS.SET_CASHBUZZ_CLASSES: {
      return {
        ...state,
        classes: action.data
      };
    }
    case CASHBUZZ_ACTIONS.SET_CASHBUZZ_POLICY: {
      return {
        ...state,
        data: action.data
      };
    }
    case CASHBUZZ_ACTIONS.SET_CASHBUZZ_QCLASSES: {
      return {
        ...state,
        qclasses: action.data
      };
    }
    case CASHBUZZ_ACTIONS.SET_ENFORCE_ACCOUNT_STATUS: {
      return {
        ...state,
        enforceAccountSelection: action.data
      };
    }
    default:
      return state;
  }
};

export default cashbuzzReducer;
