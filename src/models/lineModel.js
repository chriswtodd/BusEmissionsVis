/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import store from '../redux/store.js';

let modelData = require('./modelData.ts');

export function processLineData(data) {
    let filters = store.getState().filters;

    let p = filters.emissionType;
    const engineTypes = Object.entries(modelData.EngineTypes).map(kvp => kvp[0]);

    let keys = ["date"].concat(engineTypes)
        .filter(d => filters.class[d] || d === "date")

    let lineData = [];
    engineTypes.forEach(engineType => {
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