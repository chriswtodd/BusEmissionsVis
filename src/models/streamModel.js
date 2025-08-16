/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import { store } from '../redux/store.js';

let modelData = require('./modelData.ts');

export function processStreamData(data) {
    let filters = store.getState().filters;
    let keys = ["date"].concat(Object.entries(modelData.EngineTypes).map(kvp => kvp[0]));
    
    // Filter data according to UI
    keys = keys.filter(d => filters.class[d] || d === "date")

    let p = filters.emissionType;

    let drawData = [];
    data.forEach((d) => {
        if (keys.includes(d.engine_type)) {
            let obj = {};
            obj.date = d.date;
            obj[d.engine_type] = d[p];
            drawData.push(obj);
        }
    })
    let final = [];
    let reducedDates = Array.from(new Set(drawData.map(d => d.date)));
    reducedDates.sort((a, b) => {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    });
    for (let d of reducedDates) {
        let newObj = {};
        keys.forEach(key => {
            newObj[key] = 0;
            if (key === "date") {
                newObj[key] = d;
            }
        })
        final.push(newObj);
    }
    for (let d of final) {
        for (let e of drawData) {
            //On the same date
            if (d.date === e.date) {
                //Only if keys part of keys
                let key = Object.keys(e)[1];
                d[key] = e[key];
            }
        }
    }

    return final;
}