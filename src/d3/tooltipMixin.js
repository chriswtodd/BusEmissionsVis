/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import * as d3 from "d3";
const styles = require("../styles.js");

export let streamTooltipFactoryMixin = {
    tooltipKeys: "",
    setTooltipKeys(keys) {
        this.tooltipKeys = keys;
    },

    createBars() {
        let t = this;
        let currentDay = new Date(this.data[0].date), nextDay = new Date(this.data[0].date);
        nextDay.setDate(nextDay.getDate() + 1);
        let widthTooltipBars = this.xScale(nextDay) - this.xScale(currentDay);
        // d3.select(this.focus.node().parentNode)
        this.ttBars = this.focus
            .selectAll(".plot-rect")
            .remove()
            .exit()
            .data(this.streamData)
            .enter()
            .append("rect")
            .attr("class", "plot-rect")
            .on("mouseover", function () {

            })
            .attr("x", function (d) {
                return t.xScale(new Date(d.date));
            })
            .attr("width", function (d, i) {
                return widthTooltipBars;
            })
            .attr("height", 1)
            .attr("border", "1px solid black")
            .style("fill", "white")
            .style("opacity", 0);
    },

    updateBars() {
        let t = this;
        let currentDay = new Date(this.data[0].date), nextDay = new Date(this.data[0].date);
        nextDay.setDate(nextDay.getDate() + 1);
        let widthTooltipBars = this.xScale(nextDay) - this.xScale(currentDay);
        this.ttBars = this.ttBars
            .selectAll(".plot-rect")
            .data(this.streamData, d => d.date)

            this.ttBars
                .enter()
                .append("rect")
                .join(this.ttBars)
                .merge(this.ttBars)
                .attr("class", "plot-rect")
                .attr("x", function (d) {
                    return t.xScale(new Date(d.date));
                })
                .attr("width", function (d, i) {
                    return widthTooltipBars;
                })
                .attr("height", 1)
                .attr("border", "1px solid black")
                .style("fill", "white")
                .style("opacity", 0);
    },

    createLineChartTooltip(top, left, infoDots, id, property) {
        //Draw tooltip
        d3.select("#".concat(this.containerId))
            .insert("div", ":first-child")
            .attr("id", id)
            .attr("width", "100px")
            .attr("height", "100px")
            .style("background", styles.ttBackground)
            .style("padding", "10px")
            .style("cursor", "none")
            .style("border", `1px ${styles.background_colour} solid`)
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("position", "absolute")
            .style("left", left + "px")
            .style("top", top + "px")
            .html("<p>" + infoDots.date.toString().split(/[0-9]{2}:/)[0] + "</p>"
                + "<p> " + property + " </p>"
                + "<br><span class=\"toolTip__vehicle-dot_el\"></span> ELECTRIC : " + Math.round(infoDots["ELECTRIC"] * 100) / 100
                + "<br><span class=\"toolTip__vehicle-dot_EURO6\"></span> EURO6 : " + Math.round(infoDots["EURO6"] * 100) / 100
                + "<br><span class=\"toolTip__vehicle-dot_EURO5\"></span> EURO5 : " + Math.round(infoDots["EURO5"] * 100) / 100
                + "<br><span class=\"toolTip__vehicle-dot_EURO4\"></span> EURO4 : " + Math.round(infoDots["EURO4"] * 100) / 100
                + "<br><span class=\"toolTip__vehicle-dot_EURO3\"></span> EURO3 : " + Math.round(infoDots["EURO3"] * 100) / 100
                + "<br><span class=\"toolTip__vehicle-dot_EURO2\"></span> EURO2 : " + Math.round(infoDots["EURO2"] * 100) / 100);
    },

    drawLineChartTooltip (top, left, infoDots, ttName, property) {
        //Select tooltip
    
        let timeStamp = infoDots.date.toString();
        if (timeStamp.split(" ")[4] === "00:00:00") {
            timeStamp = infoDots.date.toString().split(/[0-9]{2}:/)[0];
        }
    
        d3.select("#".concat(this.containerId))
            .select("#".concat(ttName))
            .style("background", styles.ttBackground)
            .style("display", "flex")
            .style("left", left + "px")
            .style("top", top + "px")
            .html("<p>" + timeStamp + "</p>"
            + "<p> " + property + " </p>"
            + "<br><span class=\"toolTip__vehicle-dot_el\"></span> ELECTRIC : " + Math.round(infoDots["ELECTRIC"] * 100) / 100
            + "<br><span class=\"toolTip__vehicle-dot_EURO6\"></span> EURO6 : " + Math.round(infoDots["EURO6"] * 100) / 100
            + "<br><span class=\"toolTip__vehicle-dot_EURO5\"></span> EURO5 : " + Math.round(infoDots["EURO5"] * 100) / 100
            + "<br><span class=\"toolTip__vehicle-dot_EURO4\"></span> EURO4 : " + Math.round(infoDots["EURO4"] * 100) / 100
            + "<br><span class=\"toolTip__vehicle-dot_EURO3\"></span> EURO3 : " + Math.round(infoDots["EURO3"] * 100) / 100
            + "<br><span class=\"toolTip__vehicle-dot_EURO2\"></span> EURO2 : " + Math.round(infoDots["EURO2"] * 100) / 100);
    },

    addTooltipToSvg(ttName, ttTitle) {
        let widthTooltipBars = this.graphBounds.xaxis / this.streamData.length;
        let t = this;
        this.focus.on("mouseover", function (event) {
            let onDot = false;
            for (let area of t.streamData) {
                //If the dots are hovered on
                if (d3.pointer(event)[0] > t.xScale(new Date(area.date))
                    && d3.pointer(event)[0] < t.xScale(new Date(area.date)) + widthTooltipBars) {
                    //set onDot
                    onDot = true;
                    //get the tooltip info
                    let infoDots = t.streamData.filter(d => 
                        new Date(d.date).getTime() === new Date(area.date).getTime())[0];
                    let engineTypesEmissions = [];
                    for (let key of t.tooltipKeys) {
                        engineTypesEmissions.push({
                            emissions: infoDots[key],
                            engine: key
                        });
                    }
                    let top = event.pageY + 200 > t.height ? event.pageY - 200 : event.pageY + 5;
                    //See if the tooltip exists
                    if (d3.select("#".concat(t.containerId))
                        .select("#".concat(ttName))
                        .empty()
                    ) {

                        t.createLineChartTooltip(top, event.pageX + 5, area, ttName, ttTitle);
                        d3.select("body")
                            .selectAll(".plot-rect")
                            .filter(d => { return d.date === area.date; })
                            .attr("height", t.graphBounds.yaxis)
                            .style("opacity", 0.4)
                    }
                    //If tooltip exists select and draw
                    else {
                        t.drawLineChartTooltip(top, event.pageX + 5, area, ttName, ttTitle);
                        d3.select("body")
                            .selectAll(".plot-rect")
                            .attr("height", 1)
                            .style("opacity", 0)
                        d3.select("body")
                            .selectAll(".plot-rect")
                            .filter(d => { return d.date === area.date; })
                            .attr("height", t.graphBounds.yaxis)
                            .style("opacity", 0.4)
                    }
                }
            }
            //If not on dot hide
            if (onDot === false) {
                d3.select("body")
                    .select("#".concat(ttName))
                    .attr("fill", "none")
                    .style("display", "none");
                d3.select("body")
                    .selectAll(".plot-rect")
                    .attr("height", 1)
                    .style("opacity", 0)
            }
        })
        .on("mouseout", function (d) {
            //If selection not empty, remove tooltip on mouse leave
            if (!d3.select("#".concat(t.containerId))
                .select("#".concat(ttName))
                .empty()
            ) {
                d3.select("#".concat(ttName))
                    .attr("fill", "none")
                    .style("display", "none");
                d3.selectAll(".plot-rect")
                    .attr("height", 1)
                    .style("opacity", 0)
            }
        })
        .on("mouseleave", function (d) {
            //If selection not empty, remove tooltip on mouse leave
            if (
                !d3.select("#".concat(t.containerId))
                .select("#".concat(ttName))
                .empty()
            ) {
                d3.select("#".concat(ttName))
                    .attr("fill", "none")
                    .style("display", "none");
                d3.selectAll(".plot-rect")
                    .attr("height", 1)
                    .style("opacity", 0)
            }
        })
    }
}