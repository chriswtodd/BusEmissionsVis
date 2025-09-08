/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

export const envVarsSlice = createSlice({
    name: 'env',
    initialState: {
        publicUrl: {},
        apiUrl: {},
        loading: true,
    },
    reducers: {
        setPublicUrl: (state) => {
            state.publicUrl = import.meta.env.VITE_APP_PUBLIC_DEV_URL;
        },
        setApiUrl: (state) => {
            state.apiUrl = '/api';
        },
        setLoading: (state, payload) => {
            state.loading = payload.payload;
        }
    }
})

export const { setApiUrl, setPublicUrl, setLoading } = envVarsSlice.actions;
export const envVarReducer = envVarsSlice.reducer;