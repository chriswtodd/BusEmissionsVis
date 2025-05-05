/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

export const envVarsSlice = createSlice({
    name: 'env',
    initialState: {
        url: {},
        loading: true,
    },
    reducers: {
        setUrl: (state, payload) => {
            state.url = import.meta.env.VITE_APP_DEV_URL;
            if (payload.payload.includes("bevferle")) {
                state.url = import.meta.env.VITE_APP_DEPLOYMENT_URL;
            }
        },
        setLoading: (state, payload) => {
            state.loading = payload.payload;
        }
    }
})

export const { setUrl, setLoading } = envVarsSlice.actions;
export const envVarReducer = envVarsSlice.reducer;