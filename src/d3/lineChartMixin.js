/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import * as d3 from "d3";
const styles = require("../styles.js")

export let lineChartMixin = {
    drawnLines: [],
    setColorScheme(colorScheme) { this.colorScheme = colorScheme; },
    setKeys(keys)               { this.keys = keys; },
    setLineData(data)         { this.lineData = data; },

    /**
     * Takes line chart data in JSON
     * and returns the maximum of all points in 
     * all of the columns.
     * 
     * 
     * @param {*} stack 
     * @param {*} stackKeys 
     */
    calcMaxHeight(data) {
        return data.map(d => {
            let max = 0;
            d.data.forEach(entry => {
                max = max < entry.y ? entry.y : max;
            })
            return max;
        })
    },

    addLineToChart(data) {
        let lineFunction = this.createLineForChart();
        let path = this.focus
            .select("g")
            .append("path")
            .attr("class", "bus-type_path")
            .attr("d", lineFunction(data))

    // let totalPathLength = path.node().getTotalLength();

    // path
    //     .attr("stroke-dasharray", totalPathLength + " " + totalPathLength)
    //     .attr("stroke-dashoffset", totalPathLength)
    //     .transition()
    //     .duration(20000)
    //     .ease(d3.easeLinear)
    //     .attr("stroke-dashoffset", 0);
    // path
    //     .transition()
    //     .duration(20000)
    //     .ease(d3.easeLinear)
    //     .attr("stroke-dashoffset", totalPathLength);
        return path;
    },
    
    createLineForChart() {
        let t = this;
        return d3.line()
            .x(function (d) {
                return t.xScale(new Date(d["x"]));
            })
            .y(function (d) {
                return t.yScale(d["y"]);

            // let value = 0;
            // //Add all the previous lines according to reverse order
            // for (let i = Object.keys(engine_colours).reverse().indexOf(category); i > -1; i--) {
            //     value = value + d[Object.keys(engine_colours).reverse()[i]];
            // }
            // return;
            })
            .curve(d3.curveMonotoneX);
    },

    /**
     * Called to initialise the graph, only called once per draw
     */
    enter() {        
        let yMax = d3.max(this.calcMaxHeight(this.lineData, this.keys));
        this.drawYAxis(0, yMax);

        for (let lineEntry of this.lineData) {
            if (lineEntry.data.length === 0)
                continue;
            let drawnLine = this.addLineToChart(lineEntry.data);
            drawnLine.attr("fill", "none")
            drawnLine.style("stroke", this.colorScheme[lineEntry.key])
            drawnLine.style("stroke-width", 3)
            this.drawnLines[lineEntry.key] = (drawnLine);
        }
    },

    /**
     * Update, called after enter to update the visualisation with new data
     * e.g             
     * let fetchURL = encodeURI(`http://127.0.0.1:5000/${granularity}/wellington/${d1}/${d2}`);
     * let res = await fetch(fetchURL);
     * const json = await res.json();
     * dispatch(setLineData(json));
     * Graph.render();
     */
    render() {
        let yMax = d3.max(this.calcMaxHeight(this.lineData, this.keys));
        this.drawYAxis(0, yMax);

        this.g
            .selectAll(".bus-type_path")
            .remove();

        for (let lineEntry of this.lineData) {
            if (lineEntry.data.length === 0)
                continue;
            let drawnLine = this.addLineToChart(lineEntry.data);
            drawnLine.attr("fill", "none")
            drawnLine.style("stroke", this.colorScheme[lineEntry.key])
            drawnLine.style("stroke-width", 3)
            this.drawnLines[lineEntry.key] = (drawnLine);
        }
    }
}