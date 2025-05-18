/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import windowsReducer from '../redux/windowSlice.js';
import { streamDataReducer } from '../redux/dataSlice.js';
import { filterReducer } from '../redux/filterSlice';
import { envVarReducer } from './envVarsSlice.js';
import { emissionsApi } from './query/emissionsApi.js';
import { loginApi } from '../react-query/createSessionApi.tsx';

export const store = configureStore({
  reducer: {
    envVars: envVarReducer,
    windows: windowsReducer,
    data: streamDataReducer,
    filters: filterReducer,
    [emissionsApi.reducerPath]: emissionsApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(emissionsApi.middleware)
    .concat(loginApi.middleware)
})

setupListeners(store.dispatch)