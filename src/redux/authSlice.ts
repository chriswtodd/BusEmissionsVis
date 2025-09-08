/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: "",
        expiresIn: 0,
        tokenType: "",
    },
    reducers: {
        setAccessToken: (state, payload) => {
            state.accessToken = payload.payload;
        },
        setExpiresIn: (state, payload) => {
            state.expiresIn = payload.payload;
        },
        setTokenType: (state, payload) => {
            state.tokenType = payload.payload;
        },
    }
})

export const { setAccessToken, setTokenType, setExpiresIn } = authSlice.actions;
export const authReducer = authSlice.reducer;