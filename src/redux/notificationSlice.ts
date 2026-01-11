import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        isVisible: false,
        title: null,
        message: null,
        notificationType: null,
    },
    reducers: {
        setVisible: (state, payload) => {
            state.isVisible = payload.payload;
        },
        setTitle: (state, payload) => {
            state.title = payload.payload;
        },
        setMessage: (state, payload) => {
            state.message = payload.payload;
        },
        setNotificationType: (state, payload) => {
            state.notificationType = payload.payload;
        },
    }
})

export const { setVisible, setTitle, setMessage } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;