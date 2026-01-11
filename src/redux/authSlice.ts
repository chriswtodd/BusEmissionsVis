import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: null
    },
    reducers: {
        setUserInfo: (state, payload) => {
            state.userInfo = payload.payload;
        }
    }
})

export const { setUserInfo } = authSlice.actions;
export const authReducer = authSlice.reducer;