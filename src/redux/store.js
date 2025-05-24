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
import { getRoutesApi } from '../redux/query/getRoutesApi';

export const store = configureStore({
  reducer: {
    envVars: envVarReducer,
    windows: windowsReducer,
    data: streamDataReducer,
    filters: filterReducer,
    [getRoutesApi.reducerPath]: getRoutesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(getRoutesApi.middleware)
})

setupListeners(store.dispatch)