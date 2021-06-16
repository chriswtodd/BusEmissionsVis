/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
    name: 'data',
    initialState: {
        granularity: "day",
        startTime: "00:00",
        endTime: "23:59",
        class: {
          "PRE-EURO" : true,
          "EURO1" : true,
          "EURO2" : true,
          "EURO3" : true,
          "EURO4" : true,
          "EURO5" : true,
          "EURO6" : true,
          "ELECTRIC" : true,
        },
        routes: "",
    },
    reducers: {
        setClasses: (state, payload) => {
            state.class[payload.payload] = !state.class[payload.payload];
        },
        setReqGranularity: (state, payload) => {
            console.log(state, payload);
            state.granularity = payload.payload
        },
        setStartTime: (state, payload) => {
            state.startTime = payload.payload;
        },
        setEndTime: (state, payload) => {
            state.endTime = payload.payload;
        }
    }
})

export const { setClasses, setReqGranularity, setStartTime, setEndTime } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;