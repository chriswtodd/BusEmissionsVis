/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import windowsReducer from './windowSlice.js';
import { streamDataReducer } from './dataSlice.js';
import { filterReducer } from './filterSlice';
import { authReducer } from './authSlice.ts';
import { envVarReducer } from './envVarsSlice.js';
import { emissionsApi } from './query/emissionsApi.ts';
import { loginApi } from './query/loginApi.ts';
import { notificationReducer } from './notificationSlice.ts';

export const store = configureStore({
  reducer: {
    envVars: envVarReducer,
    windows: windowsReducer,
    data: streamDataReducer,
    filters: filterReducer,
    auth: authReducer,
    notification: notificationReducer,
    [emissionsApi.reducerPath]: emissionsApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(emissionsApi.middleware)
    .concat(loginApi.middleware)
})

setupListeners(store.dispatch)