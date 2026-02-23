/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

console.log(import.meta.env)

export const envVarsSlice = createSlice({
    name: 'env',
    initialState: {
        publicUrl: {},
        apiPrefix: {},
        loading: true,
    },
    reducers: {
        setPublicUrl: (state) => {
            state.publicUrl = import.meta.env.VITE_APP_API_URL;
        },
        setApiPrefix: (state) => {
            state.apiPrefix = '/api';
        },
        setLoading: (state, payload) => {
            state.loading = payload.payload;
        }
    }
})

export const { setPublicUrl, setApiPrefix, setLoading } = envVarsSlice.actions;
export const envVarReducer = envVarsSlice.reducer;