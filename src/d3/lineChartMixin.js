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
     * Bind a graph with a zoom function and connect its zooming to a brush on a separate
     * graph. For an example, 
     * see: https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
     * 
     * @param {D3Graph} brushedGraph 
     * @param {D3Graph} zoomedGraph 
     */
    addBrushAndZoom(brushedGraph, zoomedGraph) {
        let headerHeight = styles.convertToInt(styles.window_header_height);
        //Brush
        let brush = d3.brushX()
            .extent([[0, headerHeight], [brushedGraph.graphBounds.xaxis, brushedGraph.graphBounds.yaxis]])
            .on("brush", brushed)
        //Zoom
        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [zoomedGraph.graphBounds.xaxis, zoomedGraph.graphBounds.yaxis]])
            .extent([[0, 0], [zoomedGraph.graphBounds.xaxis, zoomedGraph.graphBounds.yaxis]])
            .on("zoom", zoomed)

        brushedGraph.focus
            .append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, zoomedGraph.xScale.range())

        this.enter();
        this.render();

        function zoomed(event, d) {
            // if (event.sourceEvent == undefined) return; // ignore zoom-by-brush
            var t = event.transform;
            // Clear previous ticks
            zoomedGraph.focus
                .selectAll(".x-ticks")
                .remove()
                .exit();
            //Rescale x
            zoomedGraph.gX
                .call(zoomedGraph.xAxis.scale(t.rescaleX(zoomedGraph.xScale)));
            // Call brush to move to match zoom
            brushedGraph.focus.select(".brush")
                .call(brush.move, zoomedGraph.xScale.range().map(t.invertX, t)); 
            // Transform main graph
            zoomedGraph.focus.select("#plot")
                .attr("transform", "translate(" + t.x + ") scale(" + t.k + ",1)");
            // Restyle
            zoomedGraph.gX
                .selectAll(".tick")
                .selectAll("text")
                .attr("text-anchor", "start")
                .attr("transform", "translate(-35, 0)")
                .attr("font-size", "1.2em")
                .attr("font-weight", "bold");
        }

        function brushed(event, d) {
            // if (event.sourceEvent == undefined) return; // ignore brush-by-zoom
            var s = event.selection || brushedGraph.xScale.range();
            let t = d3.zoomIdentity
                .scale(zoomedGraph.graphBounds.xaxis / (s[1] - s[0]))
                .translate(-s[0], 0);
            // Clear previous ticks
            zoomedGraph.focus
                .selectAll(".x-ticks")
                .remove()
                .exit();

            zoomedGraph.xScale.domain(s.map(brushedGraph.xScale.invert, brushedGraph.xScale));
            zoomedGraph.gX
                .call(zoomedGraph.xAxis.scale(t.rescaleX(zoomedGraph.xScale)));
            
            zoomedGraph.focus
                .select("#plot")
                .attr("transform", "translate(" + t.x + ") scale(" + t.k + ",1)");

            //Redraw styles
            zoomedGraph.gX
                .selectAll(".tick")
                .selectAll("text")
                .attr("text-anchor", "start")
                .attr("transform", "translate(-35, 0)")
                .attr("font-size", "1.2em")
                .attr("font-weight", "bold");
        }
    },

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
            .attr("d", lineFunction(data));

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

        this.g.append("rect")
            .attr("width", this.graphBounds.xaxis)
            .attr("height", this.graphBounds.yaxis)
            .attr("fill", "rgba(255,255,255,1)")


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
            let totalPathLength = drawnLine.node().getTotalLength();
            drawnLine
                .attr("stroke-dasharray", totalPathLength + " " + totalPathLength)
                .attr("stroke-dashoffset", totalPathLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
            this.drawnLines[lineEntry.key] = (drawnLine);
        }
    }
}