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
//import { routesApi } from './query/routesApi.js';
import { emissionsApi } from './query/emissionsApi.js';

export const store = configureStore({
  reducer: {
    envVars: envVarReducer,
    windows: windowsReducer,
    data: streamDataReducer,
    filters: filterReducer,
  //  [routesApi.reducerPath]: routesApi.reducer,
    [emissionsApi.reducerPath]: emissionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  //.concat(routesApi.middleware)
  .concat(emissionsApi.middleware)
})

setupListeners(store.dispatch)