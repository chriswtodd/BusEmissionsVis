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
        emissionType: "co2",
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
        },
        setEmissionType: (state, payload) => {
            if (payload.payload === "Average Distance") {
                state.emissionType = "avgDistance";
            } else if (payload.payload === "Average Speed") {
                state.emissionType = "avgSpeed";
            } else if (payload.payload === "Average Time") {
                state.emissionType = "avgTime";
            } else if (payload.payload === "CO2") {
                state.emissionType = "co2";
            } else if (payload.payload === "CO") {
                state.emissionType = "co";
            } else if (payload.payload === "Fuel Consumption") {
                state.emissionType = "fc";
            } else if (payload.payload === "Hydro Carbons") {
                state.emissionType = "hc";
            } else if (payload.payload === "Nitrogen Oxide") {
                state.emissionType = "nox";
            } else if (payload.payload === "Particulate Matter") {
                state.emissionType = "pm";
            } else if (payload.payload === "Passenger Km") {
                state.emissionType = "paxKm";
            } else if (payload.payload === "Trips") {
                state.emissionType = "trips";
            }
        }
    }
})

export const { setClasses, setReqGranularity, setStartTime, setEndTime, setEmissionType } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;