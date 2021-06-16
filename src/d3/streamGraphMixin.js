/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import * as d3 from "d3";
const styles = require("../styles.js")

export let streamGraphMixin = {
    area: d3.area(),
    setColorScheme(colorScheme) { this.colorScheme = colorScheme; },
    setKeys(keys)               { this.keys = keys; },
    setStreamData(data)         { this.streamData = data; },

    /**
     * Takes processed stack data in the form return by d3.stack()
     * and returns the maximum sum of all points in all of the columns.
     * 
     * 
     * @param {*} stack 
     * @param {*} stackKeys 
     */
    calcStackHeight(stack, stackKeys) {
        return stack.map(d => {
            let sum = 0;
            Object.keys(d).forEach(key => {
                if (stackKeys.includes(key)) {
                    sum = sum + d[key];
                }
            })
            return sum;
        })
    },

    /**
     * Bind a graph with a zoom function and connect its zooming to a brush on a separate
     * graph. For an example, 
     * see: https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
     * 
     * @param {D3Graph} brushedGraph 
     * @param {D3Graph} zoomedGraph 
     */
    addBrushAndZoom(brushedGraph, zoomedGraph) {
        //Brush
        let brush = d3.brushX()
            .extent([[0, 0], [brushedGraph.graphBounds.xaxis, brushedGraph.graphBounds.yaxis]])
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

        zoomedGraph.focus
            .select("#plot")
            .call(zoom)

        // zoomedGraph.focus
        //     .select("#plot")
        //     .append("clipPath")
        //     .attr("id", "zoom")
        //     .append("rectangle")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", zoomedGraph.graphBounds.xaxis)
        //     .attr("height", zoomedGraph.graphBounds.yaxis)

        // zoomedGraph.focus = zoomedGraph.focus.select("#zoom")

        function zoomed(event, d) {
            if (event.sourceEvent == undefined) return; // ignore zoom-by-brush
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
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        }

        function brushed(event, d) {
            if (event.sourceEvent == undefined) return; // ignore brush-by-zoom
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
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        }
    },

    /**
     * Called to initialise the graph, only called once per draw
     */
    enter() {
        let t = this;

        this.stackedData = d3.stack()
            .offset(d3.stackOffsetNone)
            .keys(this.keys)
            (this.streamData)
        
        let yMax = d3.max(this.calcStackHeight(this.streamData, this.keys));
        this.drawYAxis(0, yMax);

        this.blankArea = d3.area()
            .x(d => {
                return t.xScale(new Date(d.data.date));
            })
            .y0(d => { return t.height - t.margin.bottom; })
            .y1(d => { return t.height - t.margin.bottom; })
            .curve(d3.curveMonotoneX);

            
        // Select all paths (enter)
        this.path = this.g
            .selectAll(".mylayers")
            .data(this.stackedData);
        // Update selection
        // Set area to zero so it has a growing effect
        // when drawing
        this.path
            .enter()
            .append("path")
            .attr("class", "mylayers")
            .on("mouseover", function (d, i) {

            })
            .on("mousemove", function (d, i) {
                d3.select(this)
                    .attr("stroke", "black");
            })
            .on("mouseout", function () {
                t.g.selectAll(".mylayers")
                    .transition()
                    // .attr("transition-duration", "300ms")
                    .attr("opacity", 1);
                d3.select(this)
                    .attr("stroke", "none");
            })
            .attr("opacity", 1)
            .style("fill", function (d) { return t.colorScheme[d.key] })
            .attr("d", this.blankArea)        
    },

    /**
     * Update, called after enter to update the visualisation with new data
     * e.g             
     * let fetchURL = encodeURI(`http://127.0.0.1:5000/${granularity}/wellington/${d1}/${d2}`);
     * let res = await fetch(fetchURL);
     * const json = await res.json();
     * dispatch(setStreamData(json));
     * Graph.render();
     */
    render() {
        let t = this;

        //Set the y domain
        let yMax = d3.max(this.calcStackHeight(this.streamData, this.keys));
        this.yScale.domain([0, yMax]);
        this.focus.select(".y").call(d3.axisLeft(this.yScale))

        //Reset stackedData
        //this.streamData is updated externally,
        //and we are using pure JS in this file,
        //so we must recalculate instead of relying 
        //on a cached version
        this.stackedData = d3.stack()
            .offset(d3.stackOffsetNone)
            .keys(this.keys)
            (this.streamData)

        this.area = d3.area()
            .x(function (d, i) {
                return t.xScale(new Date(d.data.date));
            })
            .y0(function (d) {
                return t.yScale(d[0]);
            })
            .y1(function (d) {
                return t.yScale(d[1]);
            }).curve(d3.curveMonotoneX)

        //Enter data
        this.path = this.g
            .selectAll(".mylayers")
            .data(this.stackedData);

        //Using same selection, update path
        this.path
            .join(
                enter => enter,
                    // .append("path")
                    // .attr("class", "mylayers")
                    // .attr("d", this.blankArea),
                update => update,
                exit => exit
                    .attr("d", this.area)
                    .remove()
            )
            .transition()
            .duration(600)
            .ease(d3.easeExpInOut)
            .attr("delay", "1000")
            .attr("d", this.area)
            .style("fill", function (d) { return t.colorScheme[d.key] });
    }
}