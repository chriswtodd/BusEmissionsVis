/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useEffect } from 'react';

import store from 'redux/store.js';
import { useSelector, useDispatch } from 'react-redux';
import { addWindow, extractWindow, removeWindow } from '../redux/windowSlice.js';
import { setStreamData } from '../redux/dataSlice.js';
import { setLoading } from '../redux/envVarsSlice';

import styled from "styled-components";
import SideMenuLeft from '../components/sideMenuLeft.js';
import WindowComponent from '../components/window-component.js';
import LoadingBar from '../components/loadingBar.js';

import * as d3Graph from '../d3/graph.js';
import * as d3StreamGraph from '../d3/streamGraphMixin.js';
import * as d3LineChart from '../d3/lineChartMixin.js';
import { streamTooltipFactoryMixin } from "../d3/tooltipMixin.js";

import { processStreamData } from "../models/streamModel.js";
import { processLineData } from "../models/lineModel.js";

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
    let windows = useSelector(state => state.windows);
    //Filters
    const granularity = useSelector(state => state.filters.granularity);
    const classes = useSelector(state => state.filters.class);
    const startTime = useSelector(state => state.filters.startTime);
    const endTime = useSelector(state => state.filters.endTime);
    const emissionType = useSelector(state => state.filters.emissionType);

    function getRenderedComponentFunction(windowId) {
        if (windows.windowRenderComponent === "Stream Graph") {
            if (windowId != "overview_window") {
                return createGraph(windowId, d3Graph.axisDateMixin,d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin,streamTooltipFactoryMixin)
            }
            return createGraph(windowId, d3Graph.axisDateMixin, d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin);
        } else if (windows.windowRenderComponent === "Line Chart") {
            if (windowId != "overview_window") {
                return createGraph(windowId, d3Graph.axisDateMixin,d3Graph.axisContinuousMixin, d3LineChart.lineChartMixin)
            }
            return createGraph(windowId, d3Graph.axisDateMixin, d3Graph.axisContinuousMixin, d3LineChart.lineChartMixin);
        }
        return {};
    }

    /**
     * Create a D3 graph with mixins
     * 
     * @param {String} windowId An id for the window, using it we can get the window out of state
     * @param  {...any} mixins The mixins defining the behaviour of the graphs
     */
    function createGraph (windowId, ...mixins) {
        let graph = new d3Graph.D3Graph(windowId)
        for (let mixin of mixins) {
            Object.assign(graph, mixin);
        }
        return graph;
    }

    /**
     * Define the type of graph to create on initialisaion
     */
    function initGraphs() {
        let graphToDraw = store.getState().windows.windowRenderComponent
        if (graphToDraw === "Stream Graph")
            windows.value.forEach(d => createStreamGraph(d.windowComponent))
        if (graphToDraw === "Line Chart")
            windows.value.forEach(d => createLineChart(d.windowComponent))
    }

    /**
     * Takes a window component and creates the graph within it
     * 
     * @param {ReactFunctionalComponent:WindowComponent} window 
     */
    function createStreamGraph(window) {
        if (window != undefined) {
            let vis = window.props.renderedComponent;
    
            //Assign date mixin for the stream graph
            vis.init();
                
            vis.setData(streamData);
            vis.setColorScheme(modelData.engine_colours);
            vis.setKeys(modelData.engine_types);
            vis.setStreamData(processStreamData(streamData));

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

    function createLineChart(window) {
        if (window != undefined) {
            let vis = window.props.renderedComponent;

            console.log(streamData)
    
            //Assign date mixin for the stream graph
            vis.init();
                
            vis.setData(streamData);
            vis.setColorScheme(modelData.engine_colours);
            vis.setKeys(modelData.engine_types);
            vis.setLineData(processLineData(streamData));

            //Set visualisation xaxis incase it needs to be redrawn
            vis.setXAxis(vis.createXAxis([new Date(2019, 0, 1), new Date(2019, 11, 10)], "Date"));
            vis.drawXAxis(vis.getXAxis(), 0, [new Date(2019, 0, 1), new Date(2019, 11, 10)]);
    
            vis.setYAxis(vis.createYAxis([0, 0], "UNIT / L"));

            vis.enter();
            vis.render();
        }
    }

    /**
     * Redraw the graphs when data changes
     * 
     * @param {JSON} newData data from API/State store
     */
    function redrawGraphs(newData) {
        let graphToDraw = store.getState().windows.windowRenderComponent
        if (graphToDraw === "Stream Graph")
            windows.value.forEach(d => renderStreamGraph(d.windowComponent, newData))
        if (graphToDraw === "Line Chart")
            windows.value.forEach(d => renderLineChart(d.windowComponent, newData))
    }

    /**
     * Redraw the stream graph with new data
     */
    function renderStreamGraph(window, newData) {
        let vis = window.props.renderedComponent;
        vis.setData(newData);
        vis.setStreamData(processStreamData(newData));
        vis.enter();
        vis.render();
    }

    /**
     * Redraw the line chart with new data
     */
    function renderLineChart(window, newData) {
        let vis = window.props.renderedComponent;
        vis.setData(newData);
        vis.setLineData(processLineData(newData));
        vis.enter();
        vis.render();
    }

    // Call use effect only once to fetch data required for visualisations
    useEffect(() => {
        async function fetchData() {
            // Fetch base set of data
            let d1 = '2019-01-01', d2 = '2019-12-10';
            console.log(`${url}/${granularity}/wellington/${d1}/${d2}/${startTime}/${endTime}`);
            let fetchURL = encodeURI(`${url}/${granularity}/wellington/${d1}/${d2}/${startTime}/${endTime}`);
            let res = await fetch(fetchURL);
            const json = await res.json();
            // Set to global draw data
            dispatch(setStreamData(json));
            // Turn off loader
            dispatch(setLoading(false));
            windows.value.forEach(d => {
                dispatch(removeWindow(d.id))
            })
            // Add windows to draw
            let firstWindow = (
                <WindowComponent key={"vis-window_0"}
                    id={"vis-window_0"}
                    // use to delete graph component and redraw
                    selectedComponent={store.getState().windows.windowRenderComponent}
                    renderedComponent={getRenderedComponentFunction("vis-window_0")}
                >
                </WindowComponent>
            )
            let overview = (
                <WindowComponent key={"overview_window"}
                    id={"overview_window"}
                    selectedComponent={store.getState().windows.windowRenderComponent}
                    renderedComponent={getRenderedComponentFunction("overview_window")}
                />
            )
            // Set state with windows
            dispatch(addWindow(firstWindow));
            dispatch(addWindow(overview));
        }

        fetchData();
    }, [])

    /**
     * Call use effect to recall flask when certain filters 
     * change
     * 
     * TODO: Add logic to stop unneccessary reloading
     */
    useEffect(() => {
        async function fetchData() {
            // Fetch new data
            let d1 = '2019-01-01', d2 = '2019-12-10';
            let fetchURL = encodeURI(`${url}/${granularity}/wellington/${d1}/${d2}/${startTime}/${endTime}`);
            let res = await fetch(fetchURL);
            const json = await res.json();
            // Set data
            dispatch(setStreamData(json));
            // Turn off loader
            dispatch(setLoading(false));
            // Redraw existing visualisations
            redrawGraphs(json);
        }
        // Turn on loader before fetch
        dispatch(setLoading(true));
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
                let graphToDraw = store.getState().windows.windowRenderComponent
                if (graphToDraw === "Stream Graph") {
                    vis.setStreamData(processStreamData(streamData));
                } else if (graphToDraw === "Line Chart") {
                    vis.setLineData(processLineData(streamData));
                }
                vis.render();
                // if (vis.id != "overview_window") {
                //     // Update the tooltip
                //     vis.addTooltipToSvg("tt-main", "CO2");
                //     // Update tt bars
                //     vis.updateBars();
                // }
            })
    }, [classes, emissionType])


    useEffect(() => {
        //Data not loaded yet
        if (!Array.isArray(streamData)) return
        windows.value.forEach(d => {
            dispatch(removeWindow(d.id))
        })
        // Add windows to draw
        let firstWindow = (
            <WindowComponent key={"vis-window_0"}
                id={"vis-window_0"}
                // use to delete graph component and redraw
                selectedComponent={store.getState().windows.windowRenderComponent}
                renderedComponent={getRenderedComponentFunction("vis-window_0")}
            >
            </WindowComponent>
        )
        let overview = (
            <WindowComponent key={"overview_window"}
                id={"overview_window"}
                selectedComponent={store.getState().windows.windowRenderComponent}
                renderedComponent={getRenderedComponentFunction("overview_window")}
            />
        )
        // Set state with windows
        dispatch(addWindow(firstWindow));
        dispatch(addWindow(overview));

        windows = store.getState().windows;
    }, [windows.windowRenderComponent])

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
                {/* Side menu left */}
                {/* Visualisation selection options */}
                <SideMenuLeft />
                {/* Loading bar */}
                <LoadingBar loading={true} />
                
                {/* Visualisation container */}
                <PageContainerVertical>
                    {useSelector(state => state.windows)
                        .value
                        .map(window => {
                            let r = (<WindowComponent key={window.windowComponent.props.id}
                                id={window.windowComponent.props.id}
                                renderedComponent={getRenderedComponentFunction(window.windowComponent.props.id)}
                                selectedComponent={window.windowComponent.props.selectedComponent}
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