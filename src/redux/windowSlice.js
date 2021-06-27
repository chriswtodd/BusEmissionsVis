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
            state.value = insertItem(state.value, {
                index: state.value.length,
                item: {
                    id: payload.payload.props.id,
                    windowComponent: payload.payload,
                }
            })
        },
        removeWindow: (state, payload) => {
            state.value = state.value.filter((d) => {
                return d.id != payload.payload;
            })
        },
        setWindowRenderComponent: (state, action) => {
            state.windowRenderComponent = action.payload;
        }
    }
})

export const { addWindow, removeWindow, setWindowRenderComponent } = windowSlice.actions;

export default windowSlice.reducer