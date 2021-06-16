/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import ReduxThunk from 'redux-thunk';
import { createAsyncThunk } from '@reduxjs/toolkit';
 
export const dataThunkFunction = createAsyncThunk('posts/fetchPosts', async () => {
    let d1 = '2019-01-01', d2 = '2019-12-10'
    let fetchURL = encodeURI(`http://127.0.0.1:5000/day/wellington/${d1}/${d2}`);
    const response = await fetch(fetchURL).then(function (response) {
        return response.json();
    })
    return response;
})