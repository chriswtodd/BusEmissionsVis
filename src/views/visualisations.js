/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useEffect } from 'react';

import store from 'redux/store.js';
import { useSelector, useDispatch } from 'react-redux';
import { addWindow, extractWindow } from '../redux/windowSlice.js';
import { setStreamData } from '../redux/dataSlice.js';

import styled from "styled-components";
import LoadingBar from '../components/loadingBar.js';
import SideMenuLeft from '../components/sideMenuLeft.js';
import WindowComponent from '../components/window-component.js';

import * as d3Graph from '../d3/graph.js';
import * as d3StreamGraph from '../d3/streamGraphMixin.js';
import { streamTooltipFactoryMixin } from "../d3/tooltipMixin.js";

import { processStreamData } from "../models/streamModel.js";

let modelData = require('../models/modelData.js')

const PageContainer = styled.div`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
`;

const PageContainerVertical = styled(PageContainer)`
    flex-direction: column;
    overflow-y: auto;
`;

export default function Visualisations(props) {
    let dispatch = useDispatch();
    //App
    const url = useSelector(state => state.envVars.url);
    //Page
    const streamData = useSelector(state => state.data.streamData);
    const windows = useSelector(state => state.windows);
    //Filters
    const granularity = useSelector(state => state.filters.granularity);
    const classes = useSelector(state => state.filters.class);
    const startTime = useSelector(state => state.filters.startTime);
    const endTime = useSelector(state => state.filters.endTime);
    const emissionType = useSelector(state => state.filters.emissionType);

    function getRenderedComponentFunction(windowId) {
        if (windowId != "overview_window") {
            return createGraph(windowId, d3Graph.axisDateMixin,d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin,streamTooltipFactoryMixin)
        }
        return createGraph(windowId, d3Graph.axisDateMixin, d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin);
    }

    function createGraph (windowId, ...mixins) {
        let graph = new d3Graph.D3Graph(windowId)
        for (let mixin of mixins) {
            Object.assign(graph, mixin);
        }
        return graph;
    }

    function initGraphs() {
        let graphToDraw = store.getState().windows.windowRenderComponent
        if (graphToDraw === "Stream Graph")
            windows.value.forEach(d => createStreamGraph(d.windowComponent))
        if (graphToDraw === "Heat Chart")
            windows.value.forEach(d => createStreamGraph(d.windowComponent))
    }

    function createStreamGraph(window) {
        if (window != undefined) {
            let vis = window.props.renderedComponent;
    
            //Assign date mixin for the stream graph
            vis.init();
                
            vis.setData(streamData);
            vis.setColorScheme(modelData.engine_colours);
            vis.setKeys(modelData.engine_types);
            vis.setStreamData(processStreamData(streamData));

            // vis.setData(streamData);
            //Set visualisation xaxis incase it needs to be redrawn
            vis.setXAxis(vis.createXAxis([new Date(2019, 0, 1), new Date(2019, 11, 10)], "Date"));
            vis.drawXAxis(vis.getXAxis(), 0, [new Date(2019, 0, 1), new Date(2019, 11, 10)]);
    
            vis.setYAxis(vis.createYAxis([0, 0], "UNIT / L"));

            vis.enter();
            vis.render();
            if (window.props.id != "overview_window") {
                // Create the tooltip
                vis.setTooltipKeys(modelData.engine_types);
                vis.addTooltipToSvg("tt-main", emissionType);
                // Create tt bars
                vis.createBars();
                // vis.updateBars();
            } else {
                // TO BE FIXED : WINDOW UPDATE
                let w1 = store.getState().windows.value[0].windowComponent.props.renderedComponent,
                w2 = store.getState().windows.value[1].windowComponent.props.renderedComponent;
                w1.addBrushAndZoom(w2, w1);
            }
        }
    }

    function redrawGraphs(newData) {
        windows.value.forEach(d => renderStreamGraph(d.windowComponent, newData))
    }

    function renderStreamGraph(window, newData) {
        let vis = window.props.renderedComponent;
        vis.setData(newData);
        vis.setStreamData(processStreamData(newData));
        vis.enter();
        vis.render();
    }

    // Call use effect only once to fetch data required for visualisations
    useEffect(() => {
        async function fetchData() {
            let d1 = '2019-01-01', d2 = '2019-12-10';
            let fetchURL = encodeURI(`${url}/${granularity}/wellington/${d1}/${d2}/${startTime}/${endTime}`);
            let res = await fetch(fetchURL);
            const json = await res.json();
            dispatch(setStreamData(json));

            let firstWindow = (
                <WindowComponent key={"vis-window_0"}
                    id={"vis-window_0"}
                    renderedComponent={getRenderedComponentFunction("vis-window_0")}
                >
                </WindowComponent>
            )
            let overview = (
                <WindowComponent id={"overview_window"}
                    id={"overview_window"}
                    renderedComponent={getRenderedComponentFunction("overview_window")}
                />
            )
            dispatch(addWindow(firstWindow));
            dispatch(addWindow(overview));
        }

        fetchData();
    }, [])

    /**
     * Call use effect to recall flask when granularity changes
     * 
     * TODO: Add logic to stop unneccessary reloading
     */
    useEffect(() => {
        async function fetchData() {
            let d1 = '2019-01-01', d2 = '2019-12-10';
            let fetchURL = encodeURI(`${url}/${granularity}/wellington/${d1}/${d2}/${startTime}/${endTime}`);
            let res = await fetch(fetchURL);
            const json = await res.json();
            console.log("NEW JSON DATA: ", json)
            dispatch(setStreamData(json));
            redrawGraphs(json);
        }
        fetchData();
    }, [granularity, startTime, endTime])

    /**
     * Call use effect to rerender window when filters change
     */
    useEffect(() => {
        windows
            .value
            .map(window => {
                let vis = window.windowComponent.props.renderedComponent
                vis.setStreamData(processStreamData(streamData));
                vis.render();
                // if (vis.id != "overview_window") {
                //     // Update the tooltip
                //     vis.addTooltipToSvg("tt-main", "CO2");
                //     // Update tt bars
                //     vis.updateBars();
                // }
            })
    }, [classes, emissionType])

    /** 
     * Call use effect to rerender components in window when windows state changes
     * 
     */ 
    useEffect(() => {
        initGraphs();
    }, [windows])

    return (
        <>
            <PageContainer>
                {/* Loading bar */}
                <LoadingBar />
                {/* Side menu left */}
                <SideMenuLeft />
                {/* Visualisation selection options */}
                {/* Side menu right? */}
                {/* Visualisation filters */}
                {/* Visualisation container */}
                <PageContainerVertical>
                    {useSelector(state => state.windows)
                        .value
                        .map(window => {
                            let r = (<WindowComponent key={window.windowComponent.props.id}
                                id={window.windowComponent.props.id}
                                renderedComponent={window.windowComponent.props.renderedComponent}
                            />)
                            return r;
                        })
                }
                </PageContainerVertical>
                {/*  */}
                {/*  */}
            </PageContainer>
        </>
    );
}