/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

export const streamDataSlice = createSlice({
    name: 'data',
    initialState: {
        streamData: {},
        heatData: {},
    },
    reducers: {
        setStreamData: (state, payload) => {
            state.streamData = payload.payload;
        },
        setHeatData: (state, payload) => {
            state.heatData = payload.payload;
        },
    }
})

export const { setStreamData } = streamDataSlice.actions;
export const streamDataReducer = streamDataSlice.reducer;