/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { createSlice, createReducer } from '@reduxjs/toolkit';
import { insertItem, removeItem } from '../redux/helpers.js';

export const windowSlice = createSlice({
    name: 'windows',
    initialState: {
        value: [],
        windowRenderComponent: "Stream Graph",
        selectedWindow: "vis-window_0",
    },
    reducers: {
        addWindow: (state, payload) => {
            console.log(state, payload);
            state.value = insertItem(state.value, {
                index: state.value.length,
                item: {
                    id:"vis-window_"+state.value.length,
                    windowComponent: payload.payload,
                }
            })
        },
        removeWindow: (state, div_id) => {
            state.value = state.value.filter((d) => {
                return d.id != div_id;
            })
        },
        setWindowRenderComponent: (state, action) => {
            state.windowRenderComponent = action.payload;
        }
    }
})

export const { addWindow, removeWindow, setWindowRenderComponent } = windowSlice.actions;

export default windowSlice.reducer