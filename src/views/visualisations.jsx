/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useEffect } from 'react';

import { store } from '../redux/store.js';
import { useSelector, useDispatch } from 'react-redux';
import { addWindow, removeWindow } from '../redux/windowSlice.js';
import { setStreamData } from '../redux/dataSlice.js';
import { setLoading } from '../redux/envVarsSlice';
import { setRoutes, setReload } from '../redux/filterSlice';
// import { useGetRoutesQuery } from '../redux/query/routesApi.js';
import { useGetEmissionsQuery, useGetRoutesQuery } from '../redux/query/emissionsApi.js';
import { emissionsApi } from '../redux/query/emissionsApi.js';
// import { RouteFilterModel } from '../models/routeFilter';

import styled from "styled-components";
import SideMenuLeft from '../components/sideMenuLeft.jsx';
import WindowComponent from '../components/window-component.jsx';
import LoadingBar from '../components/loadingBar.jsx';

import * as d3Graph from '../d3/graph.js';
import * as d3StreamGraph from '../d3/streamGraphMixin.js';
import * as d3LineChart from '../d3/lineChartMixin.js';
import { streamTooltipFactoryMixin } from "../d3/tooltipMixin.js";

import { processStreamData } from "../models/streamModel.js";
import { processLineData } from "../models/lineModel.js";

import { DefaultStartTime, DefaultEndTime } from '../common/Constants'

let modelData = require('../models/modelData.ts')

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
    // This needs to be changed to suit the React Redux way of doing things
    // Use connect to map state vars to props, use these in place of useSelector
    // useSelector still prefered over store.getState
    let dispatch = useDispatch();
    //App
    const url = useSelector(state => state.envVars.apiUrl);
    //Page
    const reload = useSelector(state => state.filters.reload);
    let windows = useSelector(state => state.windows);
    //Filters
    const granularity = useSelector(state => state.filters.granularity);
    const classes = useSelector(state => state.filters.class);
    const startTime = useSelector(state => state.filters.startTime);
    const endTime = useSelector(state => state.filters.endTime);
    const emissionType = useSelector(state => state.filters.emissionType);
    const stackType = useSelector(state => state.filters.streamType);
    const routes = useSelector(state => state.filters.routes);
    const { data: routeList,  isLoading: il, error: e } = useGetRoutesQuery(url);
    const { data: emissionsData,  isFetching: emissionsDataLoading, error: emissionsError } = useGetEmissionsQuery({
        baseUrl: url,
        model: {
            city: "wellington",
            startDate: '2019-01-01',
            endDate: '2019-12-10',
            startTime: startTime,
            endTime: endTime
        }
    });

    function getRenderedComponentFunction(windowId) {
        if (windows.windowRenderComponent === "Stream Graph") {
            if (windowId != "overview_window") {
                return createGraph(windowId, d3Graph.axisDateMixin,d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin,streamTooltipFactoryMixin)
            }
            return createGraph(windowId, d3Graph.axisDateMixin, d3Graph.axisContinuousMixin, d3StreamGraph.streamGraphMixin);
        } else if (windows.windowRenderComponent === "Line Chart") {
            if (windowId != "overview_window") {
                return createGraph(windowId, d3Graph.axisDateMixin,d3Graph.axisContinuousMixin, d3LineChart.lineChartMixin,streamTooltipFactoryMixin)
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
        if (windows.value.length <= 0) 
        {
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
    
            dispatch(addWindow(JSON.stringify(firstWindow)));
            dispatch(addWindow(JSON.stringify(overview)));
        }
        windows.value.forEach(d => initGraph(JSON.parse(d.windowComponent).key, emissionsData))
    }
    
    function decodeEmissionType(emissionType) {
        if (emissionType === "avgDistance") {
            return "KM"
        } else if (emissionType === "avgSpeed") {
            return "KM/H"
        } else if (emissionType === "avgTime") {
            return "Minutes"
        } else if (emissionType === "paxKm") {
            return "Passenger Kilometers"
        } else if (emissionType === "trips") {
            return "Trips"
        } else {
            return "KG"
        }
    }

    /**
     * Takes a window component and creates the graph within it
     * 
     * @param {string} windowId the id of the window to draw the graph on
     */
    function initGraph(windowId, data) {
        if (windowId != undefined && data != undefined) {
            let vis = getRenderedComponentFunction(windowId);
            // Update the index keys for the graph based
            // on the filters
            let keys = Object.keys(classes).filter(key => {
                return classes[key];
            })

            vis.init();
            let colours = modelData.EngineColours;
            let visKeys = Object.entries(modelData.EngineTypes).map(k => k[0]);
            vis.setColorScheme(colours);
            vis.setKeys(visKeys);
            if (vis.graphType === "lineChart")
            {
                vis.setData(processLineData(data));
            }
            else if (vis.graphType === "streamChart")
            {
                vis.decodeStackType(stackType);
                var d = processStreamData(data);
                vis.setData(d);
            }

            // the tooltip and its bars work off the data in the stream chart
            // both are fine for this purpose
            vis.setTooltipData(processStreamData(data));

            //Set visualisation xaxis incase it needs to be redrawn
            vis.setXAxis(vis.createXAxis([new Date(2019, 0, 1), new Date(2019, 11, 10)], "Date"));
            vis.drawXAxis(0, decodeEmissionType(emissionType));
    
            vis.setYAxis(vis.createYAxis([undefined, undefined], decodeEmissionType(emissionType)));
            vis.drawYAxis(0, decodeEmissionType(emissionType));

            vis.enter();
            vis.render();
            if (windowId != "overview_window") {
                // Create the tooltip
                vis.setTooltipKeys(keys);
                vis.addTooltipToSvg("tt-main", emissionType, vis.tooltipData);
                // Create tt bars
                vis.createBars(vis.tooltipData);
                // Draw Total
                vis.renderTotal();
            } else {
                // TO BE FIXED : WINDOW UPDATE
                // console.log(store.getState().windows.value[0].windowComponent)

                // let w1 = getRenderedComponentFunction(JSON.parse(store.getState().windows.value[0].windowComponent).key);
                // let w2 = getRenderedComponentFunction(JSON.parse(store.getState().windows.value[1].windowComponent).key);
                // w2.addBrushAndZoom(vis, w2);
            }
        }
    }

    function createTitleForWindow() {
        let start = "", end = "";
        if (stackType === "Normalized" && windows.windowRenderComponent === "Stream Graph") { start = "Normalized " }
        if (startTime != DefaultStartTime || endTime != DefaultEndTime) { end = " between " + startTime + " and " + endTime }
        return start + windows.windowRenderComponent + " of " + emissionType + " by class per " + granularity + end
    }

    /**
     * Call use effect to recall when certain filters 
     * change
     * 
     */
    useEffect(() => {
        dispatch(emissionsApi.util.invalidateTags(['Emissions']));
    }, [granularity, startTime, endTime])

    /**
     * Call use effect to rerender window when filters change
     */
    useEffect(() => {
        if (emissionsData != undefined) { 
            dispatch(setLoading(false));
        }
        initGraphs();
    }, [classes, emissionType, stackType, emissionsData, windows.windowRenderComponent])

    /** 
     * Update the UI component in response to an API call
     * 
     * Can probably do better here, #24
     * 
     */
    useEffect(() => {
        if (!(routeList === undefined)) {
            dispatch(setRoutes(routeList))
        }
    }, [routeList])

    return (
        <>
            <PageContainer>    
                {/* Side menu left */}
                {/* Visualisation selection options */}
                <SideMenuLeft />
                {/* Loading spinner */}
                <LoadingBar loading={emissionsDataLoading} />
                
                {/* Visualisation container */}
                <PageContainerVertical>
                    {useSelector(state => state.windows)
                        .value
                        .map(window => {
                            const component = JSON.parse(window.windowComponent)
                            const r = (
                            <WindowComponent 
                                key={component.props.id}
                                id={component.props.id}
                                renderedComponent={getRenderedComponentFunction(component.props.id)}
                                selectedComponent={component.props.selectedComponent}
                                title={createTitleForWindow()}
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