/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';
require('dotenv').config()

export const envVarsSlice = createSlice({
    name: 'env',
    initialState: {
        url: {},
    },
    reducers: {
        setUrl: (state, payload) => {
            state.url = process.env.REACT_APP_DEV_URL;
            if (payload.payload.includes("bevferle")) {
                state.url = process.env.REACT_APP_DEPLOYMENT_URL;
            }
        },
    }
})

export const { setUrl } = envVarsSlice.actions;
export const envVarReducer = envVarsSlice.reducer;