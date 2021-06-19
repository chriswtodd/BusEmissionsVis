/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { configureStore } from '@reduxjs/toolkit';
import windowsReducer from '../redux/windowSlice.js';
import { streamDataReducer } from '../redux/dataSlice.js';
import { filterReducer } from '../redux/filterSlice';
import { envVarReducer } from './envVarsSlice.js';

export default configureStore({
  reducer: {
    envVars: envVarReducer,
      windows: windowsReducer,
      data: streamDataReducer,
      filters: filterReducer,
  },
})