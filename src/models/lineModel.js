/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import store from '../redux/store.js';

let modelData = require('./modelData');

export function processLineData(data) {
    let filters = store.getState().filters;

    let p = filters.emissionType;

    let keys = ["date"].concat(modelData.engine_types)
        .filter(d => filters.class[d] || d === "date")

    let lineData = [];
    modelData.engine_types.forEach(engineType => {
        if (keys.includes(engineType)) {
            lineData.push({
                "key" : engineType,
                "data" : []
            })
        }
    })

    data.forEach(d => {
        lineData.forEach(ld => {
            if (d.engine_type === ld.key) {
                ld.data.push({"x": d.date, "y": d[p]})
                ld.data.sort((a, b) => {
                    if (new Date(a.x).getTime() > new Date(b.x).getTime()) {
                        return 1;
                    }
                    if (new Date(a.x).getTime() < new Date(b.x).getTime()) {
                        return -1;
                    }
                    return 0;
                })
            }
        })
    })

    return lineData;
}