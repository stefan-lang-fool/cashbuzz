import { combineReducers } from 'redux';

import authReducer from './auth';
import cashbuzzReducer from './cashbuzz';

export const rootReducer = combineReducers({
  auth: authReducer,
  cashbuzz: cashbuzzReducer
});

export type AppState = ReturnType<typeof rootReducer>;
